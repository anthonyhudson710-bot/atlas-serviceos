import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, LessThan, Repository } from "typeorm";
import { TrafficMinute } from "./traffic-minute.entity";

export interface RecordInput {
  statusCode: number;
  latencyMs: number;
  route: string;
  method: string;
  ip: string;
  ua: string;
  bot: boolean;
}

export interface TrafficBucket {
  t: string;
  total: number;
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
  p95: number | null;
}

export interface TrafficClient {
  ip: string;
  count: number;
  errorRate: number;
  ua: string;
  bot: boolean;
}

export interface TrafficSnapshot {
  window: string;
  since: string;
  source: string;
  excludes: string[];
  total: number;
  reqPerSec: number;
  automatedPct: number | null;
  statusMix: Record<string, number>;
  statusCodes: Record<string, number>;
  latencyMs: { p50: number; p95: number; p99: number } | null;
  buckets: TrafficBucket[];
  topRoutes: Array<{ route: string; count: number; errorRate: number }>;
  topClients: TrafficClient[];
}

const LAT_BOUNDS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
const HIST_LEN = LAT_BOUNDS.length + 1;

const MAX_MINUTES = 60;
const FLUSH_MS = 10_000;
const RETENTION_DAYS = 7;
const CLEANUP_MS = 60 * 60_000;
const ROUTE_CAP = 100;
const CLIENT_CAP = 50;
const EXCLUDES = ["/health", "/status", "/metrics"];

interface ClientAgg {
  count: number;
  errors: number;
  c4xx: number;
  ua: string;
  bot: boolean;
}

interface MinuteAgg {
  minuteMs: number;
  total: number;
  bots: number;
  c2xx: number;
  c3xx: number;
  c4xx: number;
  c5xx: number;
  codes: Record<string, number>;
  hist: number[];
  routes: Map<string, { count: number; errors: number }>;
  clients: Map<string, ClientAgg>;
}

/**
 * Persistent (Tier-2) traffic metrics. Requests aggregate in memory per minute
 * and flush to Postgres, so the data survives API redeploys/restarts. Tracks
 * counts/codes/latency, per-route tallies, and per-client attribution (IP +
 * user-agent + bot heuristic) so the dashboard can show *who* is hitting the API.
 *
 * Scope is "requests that reach this API". For all-ingress (every subdomain +
 * 502s) the same contract can later be fed from Caddy access logs.
 */
@Injectable()
export class TrafficMetricsService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectRepository(TrafficMinute) private readonly repo: Repository<TrafficMinute>,
  ) {}

  static readonly excludes = EXCLUDES;

  private readonly buffer = new Map<number, MinuteAgg>();
  private readonly dirty = new Set<number>();
  private flushTimer?: ReturnType<typeof setInterval>;
  private flushing = false;
  private lastCleanup = 0;

  async onModuleInit(): Promise<void> {
    const minuteMs = currentMinuteMs();
    try {
      const row = await this.repo.findOne({ where: { minute: new Date(minuteMs) } });
      if (row) this.buffer.set(minuteMs, entityToAgg(row));
    } catch {
      // DB not ready — start fresh, flush later.
    }
    this.flushTimer = setInterval(() => void this.flush(), FLUSH_MS);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    await this.flush();
  }

  record(input: RecordInput): void {
    const minuteMs = currentMinuteMs();
    let agg = this.buffer.get(minuteMs);
    if (!agg) {
      agg = emptyAgg(minuteMs);
      this.buffer.set(minuteMs, agg);
    }

    agg.total++;
    if (input.bot) agg.bots++;

    switch (Math.floor(input.statusCode / 100)) {
      case 2:
        agg.c2xx++;
        break;
      case 3:
        agg.c3xx++;
        break;
      case 4:
        agg.c4xx++;
        break;
      case 5:
        agg.c5xx++;
        break;
    }

    const code = String(input.statusCode);
    agg.codes[code] = (agg.codes[code] ?? 0) + 1;
    agg.hist[histIndex(input.latencyMs)]++;

    let rkey = `${input.method} ${input.route}`;
    if (!agg.routes.has(rkey) && agg.routes.size >= ROUTE_CAP) rkey = "other";
    const route = agg.routes.get(rkey) ?? { count: 0, errors: 0 };
    route.count++;
    if (input.statusCode >= 500) route.errors++;
    agg.routes.set(rkey, route);

    let ckey = input.ip;
    const overflow = !agg.clients.has(ckey) && agg.clients.size >= CLIENT_CAP;
    if (overflow) ckey = "other";
    const client = agg.clients.get(ckey) ?? {
      count: 0,
      errors: 0,
      c4xx: 0,
      ua: ckey === "other" ? "" : input.ua,
      bot: ckey === "other" ? true : input.bot,
    };
    client.count++;
    if (input.statusCode >= 500) client.errors++;
    if (Math.floor(input.statusCode / 100) === 4) client.c4xx++;
    if (ckey !== "other") {
      client.ua = input.ua;
      client.bot = input.bot;
    }
    agg.clients.set(ckey, client);

    this.dirty.add(minuteMs);
  }

  private async flush(): Promise<void> {
    if (this.flushing) return;
    this.flushing = true;
    try {
      const pending = [...this.dirty];
      this.dirty.clear();
      for (const m of pending) {
        const agg = this.buffer.get(m);
        if (agg) await this.repo.upsert(aggToEntity(agg), ["minute"]);
      }
      const keep = currentMinuteMs() - 60_000;
      for (const m of [...this.buffer.keys()]) if (m < keep) this.buffer.delete(m);

      const now = Date.now();
      if (now - this.lastCleanup > CLEANUP_MS) {
        this.lastCleanup = now;
        await this.repo.delete({ minute: LessThan(new Date(now - RETENTION_DAYS * 86_400_000)) });
      }
    } catch {
      for (const m of this.buffer.keys()) this.dirty.add(m);
    } finally {
      this.flushing = false;
    }
  }

  async snapshot(windowMinutes: number): Promise<TrafficSnapshot> {
    const minutes = Math.min(MAX_MINUTES, Math.max(1, windowMinutes));
    const nowMin = currentMinuteMs();
    const fromMs = nowMin - (minutes - 1) * 60_000;

    const rows = await this.repo.find({
      where: { minute: Between(new Date(fromMs), new Date(nowMin)) },
      order: { minute: "ASC" },
    });

    const byMinute = new Map<number, MinuteAgg>();
    for (const row of rows) byMinute.set(row.minute.getTime(), entityToAgg(row));
    for (const [m, agg] of this.buffer) {
      if (m >= fromMs && m <= nowMin) byMinute.set(m, agg);
    }

    let total = 0;
    let c2xx = 0;
    let c3xx = 0;
    let c4xx = 0;
    let c5xx = 0;
    const codes: Record<string, number> = {};
    const hist = new Array<number>(HIST_LEN).fill(0);
    const routes = new Map<string, { count: number; errors: number }>();
    const clients = new Map<string, ClientAgg>();
    const buckets: TrafficBucket[] = [];

    for (let m = fromMs; m <= nowMin; m += 60_000) {
      const agg = byMinute.get(m);
      buckets.push({
        t: new Date(m).toISOString(),
        total: agg?.total ?? 0,
        "2xx": agg?.c2xx ?? 0,
        "3xx": agg?.c3xx ?? 0,
        "4xx": agg?.c4xx ?? 0,
        "5xx": agg?.c5xx ?? 0,
        p95: agg ? percentileFromHist(agg.hist, 95) : null,
      });
      if (!agg) continue;

      total += agg.total;
      c2xx += agg.c2xx;
      c3xx += agg.c3xx;
      c4xx += agg.c4xx;
      c5xx += agg.c5xx;
      for (const [k, v] of Object.entries(agg.codes)) codes[k] = (codes[k] ?? 0) + v;
      for (let i = 0; i < HIST_LEN; i++) hist[i] += agg.hist[i] ?? 0;
      for (const [k, v] of agg.routes) {
        const r = routes.get(k) ?? { count: 0, errors: 0 };
        r.count += v.count;
        r.errors += v.errors;
        routes.set(k, r);
      }
      for (const [ip, v] of agg.clients) {
        const c = clients.get(ip) ?? { count: 0, errors: 0, c4xx: 0, ua: "", bot: v.bot };
        c.count += v.count;
        c.errors += v.errors;
        c.c4xx += v.c4xx;
        if (v.ua) c.ua = v.ua;
        c.bot = v.bot;
        clients.set(ip, c);
      }
    }

    const earliestMs = await this.earliestMinuteMs();
    const sinceMs = earliestMs != null ? Math.max(fromMs, earliestMs) : fromMs;
    const elapsedSec = Math.max(1, (Date.now() - sinceMs) / 1000);

    const statusMix: Record<string, number> = {};
    if (total > 0) {
      statusMix["2xx"] = round(c2xx / total, 4);
      statusMix["3xx"] = round(c3xx / total, 4);
      statusMix["4xx"] = round(c4xx / total, 4);
      statusMix["5xx"] = round(c5xx / total, 4);
    }

    const latencyMs =
      total > 0
        ? {
            p50: percentileFromHist(hist, 50) ?? 0,
            p95: percentileFromHist(hist, 95) ?? 0,
            p99: percentileFromHist(hist, 99) ?? 0,
          }
        : null;

    const topRoutes = [...routes.entries()]
      .map(([route, r]) => ({ route, count: r.count, errorRate: rate(r.errors, r.count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // A client is "automated" if its UA looks like a bot OR it behaves like a
    // scanner — nearly all of its requests are 4xx (probing paths that 404),
    // which catches scanners that spoof a real browser UA.
    let automated = 0;
    const topClients = [...clients.entries()]
      .map(([ip, c]) => {
        const bot = c.bot || (c.count >= 3 && c.c4xx / c.count >= 0.8);
        if (bot) automated += c.count;
        return { ip, count: c.count, errorRate: rate(c.errors, c.count), ua: c.ua, bot };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      window: `${minutes}m`,
      since: new Date(sinceMs).toISOString(),
      source: "API requests",
      excludes: EXCLUDES,
      total,
      reqPerSec: round(total / elapsedSec, 3),
      automatedPct: total > 0 ? round(automated / total, 4) : null,
      statusMix,
      statusCodes: codes,
      latencyMs,
      buckets,
      topRoutes,
      topClients,
    };
  }

  private async earliestMinuteMs(): Promise<number | null> {
    let earliest: number | null = null;
    for (const m of this.buffer.keys()) earliest = earliest == null ? m : Math.min(earliest, m);
    const row = await this.repo.find({ order: { minute: "ASC" }, take: 1 });
    if (row[0]) {
      const dbMs = row[0].minute.getTime();
      earliest = earliest == null ? dbMs : Math.min(earliest, dbMs);
    }
    return earliest;
  }
}

function currentMinuteMs(): number {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

function emptyAgg(minuteMs: number): MinuteAgg {
  return {
    minuteMs,
    total: 0,
    bots: 0,
    c2xx: 0,
    c3xx: 0,
    c4xx: 0,
    c5xx: 0,
    codes: {},
    hist: new Array<number>(HIST_LEN).fill(0),
    routes: new Map(),
    clients: new Map(),
  };
}

function aggToEntity(agg: MinuteAgg): TrafficMinute {
  const e = new TrafficMinute();
  e.minute = new Date(agg.minuteMs);
  e.total = agg.total;
  e.bots = agg.bots;
  e.c2xx = agg.c2xx;
  e.c3xx = agg.c3xx;
  e.c4xx = agg.c4xx;
  e.c5xx = agg.c5xx;
  e.codes = agg.codes;
  e.latHist = agg.hist;
  e.routes = Object.fromEntries(agg.routes);
  e.clients = Object.fromEntries(agg.clients);
  return e;
}

function entityToAgg(row: TrafficMinute): MinuteAgg {
  const hist = new Array<number>(HIST_LEN).fill(0);
  if (Array.isArray(row.latHist)) {
    for (let i = 0; i < HIST_LEN; i++) hist[i] = row.latHist[i] ?? 0;
  }
  return {
    minuteMs: row.minute.getTime(),
    total: row.total,
    bots: row.bots ?? 0,
    c2xx: row.c2xx,
    c3xx: row.c3xx,
    c4xx: row.c4xx,
    c5xx: row.c5xx,
    codes: row.codes ?? {},
    hist,
    routes: new Map(Object.entries(row.routes ?? {})),
    clients: new Map(
      Object.entries(row.clients ?? {}).map(
        ([ip, c]): [string, ClientAgg] => [
          ip,
          { count: c.count, errors: c.errors, c4xx: c.c4xx ?? 0, ua: c.ua, bot: c.bot },
        ],
      ),
    ),
  };
}

function histIndex(ms: number): number {
  for (let i = 0; i < LAT_BOUNDS.length; i++) if (ms <= LAT_BOUNDS[i]) return i;
  return HIST_LEN - 1;
}

function percentileFromHist(hist: number[], p: number): number | null {
  let total = 0;
  for (const c of hist) total += c;
  if (total === 0) return null;

  const rank = Math.ceil((p / 100) * total);
  let cum = 0;
  for (let i = 0; i < HIST_LEN; i++) {
    const count = hist[i] ?? 0;
    cum += count;
    if (cum >= rank) {
      const lower = i === 0 ? 0 : LAT_BOUNDS[i - 1];
      const upper = i < LAT_BOUNDS.length ? LAT_BOUNDS[i] : LAT_BOUNDS[LAT_BOUNDS.length - 1];
      const within = count > 0 ? (rank - (cum - count)) / count : 0;
      return Math.round(lower + (upper - lower) * within);
    }
  }
  return LAT_BOUNDS[LAT_BOUNDS.length - 1];
}

function rate(errors: number, count: number): number {
  return count > 0 ? round(errors / count, 4) : 0;
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
