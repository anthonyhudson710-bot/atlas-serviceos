import { Injectable } from "@nestjs/common";

export interface RecordInput {
  statusCode: number;
  latencyMs: number;
  route: string;
  method: string;
}

export interface TrafficBucket {
  t: string; // ISO minute start
  total: number;
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
  p95: number | null;
}

export interface TrafficSnapshot {
  window: string;
  since: string;
  source: "api-process";
  excludes: string[];
  total: number;
  reqPerSec: number;
  statusMix: Record<string, number>; // class -> fraction (0..1)
  statusCodes: Record<string, number>; // "200" -> count
  latencyMs: { p50: number; p95: number; p99: number } | null;
  buckets: TrafficBucket[];
  topRoutes: Array<{ route: string; count: number; errorRate: number }>;
}

interface Bucket {
  minute: number; // epoch minutes
  total: number;
  classes: Record<string, number>;
  codes: Record<string, number>;
  latencies: number[];
  latencyCount: number; // total observed (drives reservoir replacement)
  routes: Map<string, { count: number; errors: number }>;
}

const MAX_MINUTES = 60; // we retain the last hour
const LATENCY_CAP = 2000; // reservoir size per minute — bounds memory under load
const ROUTE_CAP = 100; // distinct routes per minute before overflow → "other"
const EXCLUDES = ["/health", "/status", "/metrics"]; // internal probes / self

/**
 * In-process, in-memory rolling-window traffic metrics for the API. A middleware
 * feeds every (non-internal) request in via record(); the dashboard reads an
 * aggregate via snapshot(). This is the honest Tier-1 source:
 *   - counts only requests that reach THIS API process (not edge/static),
 *   - resets on redeploy (state is in memory),
 *   - single-instance (the API runs one container).
 * For unsampled, persistent, all-ingress metrics, point the same contract at
 * Caddy/Prometheus later (source would change from "api-process").
 */
@Injectable()
export class TrafficMetricsService {
  private readonly buckets = new Map<number, Bucket>();
  private readonly startedAt = Date.now();

  static readonly excludes = EXCLUDES;

  record(input: RecordInput): void {
    const minute = Math.floor(Date.now() / 60_000);
    let b = this.buckets.get(minute);
    if (!b) {
      b = {
        minute,
        total: 0,
        classes: {},
        codes: {},
        latencies: [],
        latencyCount: 0,
        routes: new Map(),
      };
      this.buckets.set(minute, b);
      this.evict(minute);
    }

    b.total++;

    const cls = `${Math.floor(input.statusCode / 100)}xx`;
    b.classes[cls] = (b.classes[cls] ?? 0) + 1;

    const code = String(input.statusCode);
    b.codes[code] = (b.codes[code] ?? 0) + 1;

    // Reservoir-sample latencies so a traffic spike can't grow memory unbounded.
    b.latencyCount++;
    if (b.latencies.length < LATENCY_CAP) {
      b.latencies.push(input.latencyMs);
    } else {
      const j = Math.floor(Math.random() * b.latencyCount);
      if (j < LATENCY_CAP) b.latencies[j] = input.latencyMs;
    }

    // Per-route tallies, capped so a path-traversal / cardinality blowup can't
    // grow the map without bound.
    let key = `${input.method} ${input.route}`;
    if (!b.routes.has(key) && b.routes.size >= ROUTE_CAP) key = "other";
    let r = b.routes.get(key);
    if (!r) {
      r = { count: 0, errors: 0 };
      b.routes.set(key, r);
    }
    r.count++;
    if (input.statusCode >= 500) r.errors++;
  }

  snapshot(windowMinutes: number): TrafficSnapshot {
    const minutes = Math.min(MAX_MINUTES, Math.max(1, windowMinutes));
    const nowMin = Math.floor(Date.now() / 60_000);
    const from = nowMin - (minutes - 1);

    const classes: Record<string, number> = {};
    const codes: Record<string, number> = {};
    const routes = new Map<string, { count: number; errors: number }>();
    const latencies: number[] = [];
    const buckets: TrafficBucket[] = [];
    let total = 0;

    for (let m = from; m <= nowMin; m++) {
      const b = this.buckets.get(m);
      const entry: TrafficBucket = {
        t: new Date(m * 60_000).toISOString(),
        total: b?.total ?? 0,
        "2xx": b?.classes["2xx"] ?? 0,
        "3xx": b?.classes["3xx"] ?? 0,
        "4xx": b?.classes["4xx"] ?? 0,
        "5xx": b?.classes["5xx"] ?? 0,
        p95: null,
      };
      if (b) {
        total += b.total;
        for (const [k, v] of Object.entries(b.classes)) classes[k] = (classes[k] ?? 0) + v;
        for (const [k, v] of Object.entries(b.codes)) codes[k] = (codes[k] ?? 0) + v;
        for (const [k, v] of b.routes) {
          const r = routes.get(k) ?? { count: 0, errors: 0 };
          r.count += v.count;
          r.errors += v.errors;
          routes.set(k, r);
        }
        latencies.push(...b.latencies);
        entry.p95 = percentile(b.latencies, 95);
      }
      buckets.push(entry);
    }

    const statusMix: Record<string, number> = {};
    for (const [k, v] of Object.entries(classes)) {
      statusMix[k] = total > 0 ? round(v / total, 4) : 0;
    }

    const sorted = [...latencies].sort((a, c) => a - c);
    const latencyMs =
      sorted.length > 0
        ? {
            p50: Math.round(percentile(sorted, 50, true) ?? 0),
            p95: Math.round(percentile(sorted, 95, true) ?? 0),
            p99: Math.round(percentile(sorted, 99, true) ?? 0),
          }
        : null;

    const elapsedSec = Math.max(1, Math.min(minutes * 60, (Date.now() - this.startedAt) / 1000));
    const topRoutes = [...routes.entries()]
      .map(([route, r]) => ({ route, count: r.count, errorRate: r.count > 0 ? round(r.errors / r.count, 4) : 0 }))
      .sort((a, c) => c.count - a.count)
      .slice(0, 8);

    return {
      window: `${minutes}m`,
      since: new Date(Math.max(this.startedAt, from * 60_000)).toISOString(),
      source: "api-process",
      excludes: EXCLUDES,
      total,
      reqPerSec: round(total / elapsedSec, 3),
      statusMix,
      statusCodes: codes,
      latencyMs,
      buckets,
      topRoutes,
    };
  }

  private evict(currentMinute: number): void {
    const cutoff = currentMinute - (MAX_MINUTES - 1);
    for (const m of this.buckets.keys()) {
      if (m < cutoff) this.buckets.delete(m);
    }
  }
}

// Nearest-rank percentile. Pass preSorted=true when the array is already sorted.
function percentile(values: number[], p: number, preSorted = false): number | null {
  if (values.length === 0) return null;
  const arr = preSorted ? values : [...values].sort((a, b) => a - b);
  const idx = Math.min(arr.length - 1, Math.max(0, Math.ceil((p / 100) * arr.length) - 1));
  return arr[idx];
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
