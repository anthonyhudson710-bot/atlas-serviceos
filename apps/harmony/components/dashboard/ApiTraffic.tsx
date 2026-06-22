"use client";

// Live API traffic for the dashboard. Polls the API's persistent /metrics/traffic
// aggregator and renders a per-minute, status-stacked timeline plus summary
// stats. The source is honest about its scope (requests reaching the API, small
// real numbers; persisted across deploys) — those caveats are surfaced, not hidden.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowsClockwise,
  ChartBar,
  CircleNotch,
  Clock,
  Info,
  WarningCircle,
  WifiSlash,
} from "@phosphor-icons/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.atlasfsm.com";
const POLL_MS = 30_000;
const CHART_H = 84; // px

// 5xx share / p95 thresholds that flip a stat to its "hot" (error) treatment.
const ERROR_RATE_HOT = 0.01;
const P95_HOT_MS = 500;

type WindowSel = "15m" | "1h";

interface TrafficBucket {
  t: string;
  total: number;
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
  p95: number | null;
}
interface TrafficSnapshot {
  window: string;
  since: string;
  source: string;
  excludes: string[];
  total: number;
  reqPerSec: number;
  statusMix: Record<string, number>;
  statusCodes: Record<string, number>;
  latencyMs: { p50: number; p95: number; p99: number } | null;
  automatedPct: number | null;
  buckets: TrafficBucket[];
  topRoutes: { route: string; count: number; errorRate: number }[];
  topClients: { ip: string; count: number; errorRate: number; ua: string; bot: boolean }[];
}

// Status classes, ordered top→bottom in a stacked bar (2xx ends up at the base).
const STACK: { key: keyof TrafficBucket; color: string; label: string }[] = [
  { key: "5xx", color: "var(--red-500)", label: "5xx" },
  { key: "4xx", color: "var(--amber-400)", label: "4xx" },
  { key: "3xx", color: "var(--neutral-300)", label: "3xx" },
  { key: "2xx", color: "var(--green-500)", label: "2xx" },
];

const WINDOW_MS: Record<WindowSel, number> = { "15m": 15 * 60_000, "1h": 60 * 60_000 };

function fmtPct(frac: number | undefined): string {
  if (frac == null) return "—";
  const p = frac * 100;
  return `${p >= 10 || p === 0 ? Math.round(p) : p.toFixed(1)}%`;
}
function fmtRps(n: number): string {
  if (n >= 10) return n.toFixed(0);
  if (n >= 1) return n.toFixed(1);
  return n.toFixed(2);
}
function fmtClock(iso: string): string {
  // Deterministic given `iso` (safe in render — unlike argless Date.now()).
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function ApiTraffic() {
  const [data, setData] = useState<TrafficSnapshot | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [windowSel, setWindowSel] = useState<WindowSel>("1h");
  // Whether the available data is shorter than the requested window (recent
  // deploy zeroed the in-memory window) + a label for when it starts.
  const [partial, setPartial] = useState(false);
  const [sinceLabel, setSinceLabel] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (win: WindowSel) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/metrics/traffic?window=${win}`, {
        credentials: "include",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      const payload = (await res.json()) as TrafficSnapshot;
      // Time-derived flags computed here (in a handler) — never during render.
      const sinceMs = Date.parse(payload.since);
      if (!Number.isNaN(sinceMs)) {
        setPartial(Date.now() - sinceMs < WINDOW_MS[win] - 30_000);
        setSinceLabel(new Date(sinceMs).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      } else {
        setPartial(false);
      }
      setData(payload);
      setError(false);
      setSecondsAgo(0);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initial = setTimeout(() => void load(windowSel), 0);
    const poll = setInterval(() => void load(windowSel), POLL_MS);
    const onFocus = () => void load(windowSel);
    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(initial);
      clearInterval(poll);
      window.removeEventListener("focus", onFocus);
      abortRef.current?.abort();
    };
  }, [load, windowSel]);

  useEffect(() => {
    const t = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const selectWindow = (win: WindowSel) => {
    if (win === windowSel) return;
    setWindowSel(win);
    setLoading(true);
    setData(null);
  };

  const agoLabel = secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.round(secondsAgo / 60)} min ago`;
  const windowWord = windowSel === "15m" ? "15 min" : "hour";

  return (
    <div className="ac-card ac-pad">
      {/* Header */}
      <div className="ac-cardh items-start">
        <div className="min-w-0">
          <span className="ac-cardt">API traffic</span>
          <p className="ac-tert mt-[3px] text-[11px]">Platform API · persistent counter</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="ac-seg" role="group" aria-label="Time window">
            <button
              type="button"
              className={windowSel === "15m" ? "on" : ""}
              aria-pressed={windowSel === "15m"}
              onClick={() => selectWindow("15m")}
            >
              15m
            </button>
            <button
              type="button"
              className={windowSel === "1h" ? "on" : ""}
              aria-pressed={windowSel === "1h"}
              onClick={() => selectWindow("1h")}
            >
              1h
            </button>
          </div>
          {data && (
            <span className="ac-tert flex items-center gap-[5px] text-[11px]">
              {refreshing ? (
                <CircleNotch size={12} className="ac-spin" aria-hidden="true" />
              ) : (
                <Clock size={12} aria-hidden="true" />
              )}
              {refreshing ? "Updating…" : `Checked ${agoLabel}`}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      {loading && !data ? (
        <TrafficSkeleton />
      ) : error && !data ? (
        <Unreachable onRetry={() => void load(windowSel)} />
      ) : data ? (
        data.total === 0 ? (
          <Empty windowWord={windowWord} partial={partial} sinceLabel={sinceLabel} />
        ) : (
          <Loaded data={data} partial={partial} sinceLabel={sinceLabel} windowWord={windowWord} />
        )
      ) : null}

      {data && <Footnote source={data.source} excludes={data.excludes} />}
    </div>
  );
}

function Loaded({
  data,
  partial,
  sinceLabel,
  windowWord,
}: {
  data: TrafficSnapshot;
  partial: boolean;
  sinceLabel: string;
  windowWord: string;
}) {
  const maxTotal = Math.max(1, ...data.buckets.map((b) => b.total));
  const mix5 = data.statusMix["5xx"] ?? 0;
  const errorHot = mix5 > ERROR_RATE_HOT;
  const p95 = data.latencyMs?.p95 ?? null;
  const p95Hot = p95 != null && p95 > P95_HOT_MS;

  // X-axis: a few evenly-spaced ticks, the last one labelled "now".
  const n = data.buckets.length;
  const tickIdx = n > 1 ? [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1] : [0];

  return (
    <>
      {partial && (
        <div className="mb-3 flex items-start gap-[7px] rounded-md border border-[var(--amber-200)] bg-[var(--amber-50)] px-[10px] py-[7px] text-[11.5px] leading-[1.45] text-[var(--color-text-secondary)]">
          <Info size={13} weight="fill" aria-hidden="true" className="mt-px shrink-0 text-[var(--color-text-warning)]" />
          Window starts {sinceLabel} — less than a full {windowWord} of history yet.
        </div>
      )}

      {/* Summary stats */}
      <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
        <div className="flex items-baseline gap-2">
          <span className="ac-mono text-[26px] font-bold leading-none tracking-tight text-[var(--color-text-primary)]">
            {data.total.toLocaleString()}
          </span>
          <span className="ac-muted text-[12px]">req · {fmtRps(data.reqPerSec)}/s</span>
        </div>
        <div className="flex items-center gap-3 text-[12px]">
          <Stat label="2xx" value={fmtPct(data.statusMix["2xx"])} color="var(--color-text-success)" />
          <Stat label="4xx" value={fmtPct(data.statusMix["4xx"])} />
          <Stat
            label="5xx"
            value={fmtPct(mix5)}
            color={errorHot ? "var(--color-text-danger)" : undefined}
            hot={errorHot}
          />
        </div>
      </div>

      {/* Status-mix bar */}
      <div className="ac-bar mt-3 flex">
        {data.statusMix["2xx"] ? <i style={{ width: `${data.statusMix["2xx"] * 100}%`, background: "var(--green-500)" }} /> : null}
        {data.statusMix["3xx"] ? <i style={{ width: `${data.statusMix["3xx"] * 100}%`, background: "var(--neutral-300)" }} /> : null}
        {data.statusMix["4xx"] ? <i style={{ width: `${data.statusMix["4xx"] * 100}%`, background: "var(--amber-400)" }} /> : null}
        {data.statusMix["5xx"] ? <i style={{ width: `${data.statusMix["5xx"] * 100}%`, background: "var(--red-500)" }} /> : null}
      </div>

      {/* Per-minute timeline */}
      <div
        className="mt-4 flex items-end gap-[2px] border-b border-[var(--color-border-subtle)] pb-[1px]"
        style={{ height: CHART_H }}
        aria-hidden="true"
      >
        {data.buckets.map((b, i) => {
          const barH = b.total > 0 ? Math.max(3, Math.round((b.total / maxTotal) * CHART_H)) : 0;
          return (
            <div
              key={b.t || i}
              className="flex flex-1 flex-col overflow-hidden rounded-t-[2px]"
              style={{ height: barH }}
              title={`${fmtClock(b.t)} · ${b.total} req (2xx ${b["2xx"]}, 3xx ${b["3xx"]}, 4xx ${b["4xx"]}, 5xx ${b["5xx"]})${
                b.p95 != null ? ` · p95 ${b.p95}ms` : ""
              }`}
            >
              {STACK.map((s) => {
                const count = b[s.key] as number;
                if (!count || b.total === 0) return null;
                return <div key={s.label} style={{ height: (count / b.total) * barH, background: s.color }} />;
              })}
            </div>
          );
        })}
      </div>
      <div className="ac-tert ac-mono mt-1.5 flex justify-between text-[10px]">
        {tickIdx.map((idx, i) => (
          <span key={idx}>{i === tickIdx.length - 1 ? "now" : fmtClock(data.buckets[idx].t)}</span>
        ))}
      </div>

      {/* Latency */}
      {data.latencyMs && (
        <div className="mt-4 flex items-center gap-4 border-t border-[var(--color-border-subtle)] pt-3 text-[12px]">
          <span className="ac-tert text-[11px] font-medium">Latency</span>
          <Stat label="p50" value={`${data.latencyMs.p50}ms`} />
          <Stat label="p95" value={`${data.latencyMs.p95}ms`} color={p95Hot ? "var(--color-text-danger)" : undefined} hot={p95Hot} />
          <Stat label="p99" value={`${data.latencyMs.p99}ms`} />
        </div>
      )}

      {/* Busiest routes */}
      {data.topRoutes.length > 0 && (
        <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-3">
          <p className="ac-tert mb-2 text-[11px] font-medium">Busiest routes</p>
          <div className="flex flex-col gap-1.5">
            {data.topRoutes.slice(0, 5).map((r) => (
              <div key={r.route} className="flex items-center gap-3 text-[12px]">
                <span className="ac-mono min-w-0 flex-1 truncate text-[var(--color-text-primary)]">{r.route}</span>
                {r.errorRate > 0 && (
                  <span className="ac-chip s-danger" style={{ height: 17 }}>
                    <WarningCircle size={11} weight="fill" aria-hidden="true" />
                    {fmtPct(r.errorRate)} 5xx
                  </span>
                )}
                <span className="ac-mono ac-tert w-10 text-right tabular-nums">{r.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top sources — who is hitting the API */}
      {data.topClients.length > 0 && (
        <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="ac-tert text-[11px] font-medium">Top sources</p>
            {data.automatedPct != null && (
              <span className="ac-tert text-[11px]">{fmtPct(data.automatedPct)} automated</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {data.topClients.slice(0, 5).map((c) => (
              <div key={c.ip} className="flex items-center gap-2 text-[12px]">
                <span className={`ac-chip ${c.bot ? "s-pastdue" : "s-neutral"} shrink-0`} style={{ height: 17 }}>
                  {c.bot ? "bot" : "browser"}
                </span>
                <span className="ac-mono shrink-0 text-[var(--color-text-primary)]">{c.ip}</span>
                <span className="ac-muted min-w-0 flex-1 truncate text-[11px]" title={c.ua}>
                  {c.ua || "—"}
                </span>
                {c.errorRate > 0 && (
                  <span className="ac-chip s-danger shrink-0" style={{ height: 17 }}>
                    {fmtPct(c.errorRate)} 5xx
                  </span>
                )}
                <span className="ac-mono ac-tert w-12 shrink-0 text-right tabular-nums">
                  {c.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen-reader alternative to the chart */}
      <table className="sr-only">
        <caption>API requests per minute by status class</caption>
        <thead>
          <tr>
            <th>Time</th>
            <th>Total</th>
            <th>2xx</th>
            <th>3xx</th>
            <th>4xx</th>
            <th>5xx</th>
            <th>p95 ms</th>
          </tr>
        </thead>
        <tbody>
          {data.buckets.map((b, i) => (
            <tr key={b.t || i}>
              <td>{fmtClock(b.t)}</td>
              <td>{b.total}</td>
              <td>{b["2xx"]}</td>
              <td>{b["3xx"]}</td>
              <td>{b["4xx"]}</td>
              <td>{b["5xx"]}</td>
              <td>{b.p95 ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Stat({
  label,
  value,
  color,
  hot,
}: {
  label: string;
  value: string;
  color?: string;
  hot?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="ac-tert text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      <span
        className="ac-mono font-semibold"
        style={color ? { color } : undefined}
      >
        {hot && <WarningCircle size={11} weight="fill" aria-hidden="true" className="mr-0.5 inline align-[-1px]" />}
        {value}
      </span>
    </span>
  );
}

function Empty({
  windowWord,
  partial,
  sinceLabel,
}: {
  windowWord: string;
  partial: boolean;
  sinceLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-7 text-center">
      <ChartBar size={24} className="text-[var(--color-text-tertiary)]" aria-hidden="true" />
      <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">
        No API requests in the last {windowWord}
      </div>
      <p className="ac-muted text-[12px] leading-[1.5]">
        {partial
          ? `The window starts ${sinceLabel} and has seen no traffic yet.`
          : "Nothing has hit the API in this window. Health checks and dashboard polling aren’t counted."}
      </p>
    </div>
  );
}

function Unreachable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 pt-1">
      <div className="flex gap-[10px]">
        <WifiSlash size={20} weight="fill" className="mt-px shrink-0 text-[var(--color-text-danger)]" aria-hidden="true" />
        <div>
          <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">
            Can&apos;t load traffic
          </div>
          <p className="ac-muted mt-[3px] text-[12px] leading-[1.5]">
            The <code className="ac-mono">/metrics/traffic</code> endpoint didn&apos;t respond, or your
            session has expired.
          </p>
        </div>
      </div>
      <button type="button" onClick={onRetry} className="ac-btn b-sec sm">
        <ArrowsClockwise size={14} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}

function TrafficSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="flex items-end justify-between gap-x-5">
        <span className="ac-sk h-7 w-24" />
        <span className="ac-sk h-4 w-32" />
      </div>
      <span className="ac-sk mt-3 block h-[7px] w-full rounded-full" />
      <div className="mt-4 flex items-end gap-[2px]" style={{ height: CHART_H }}>
        {[58, 72, 40, 84, 64, 50, 78, 46, 90, 60, 70, 54].map((h, i) => (
          <span key={i} className="ac-sk flex-1 rounded-t-[2px]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function Footnote({ source, excludes }: { source: string; excludes: string[] }) {
  return (
    <p className="ac-tert mt-3 flex items-start gap-[6px] border-t border-[var(--color-border-subtle)] pt-2.5 text-[10.5px] leading-[1.5]">
      <Info size={12} aria-hidden="true" className="mt-px shrink-0" />
      <span>
        {source} · excludes {excludes.length ? excludes.join(", ") : "internal endpoints"} · persisted
        (Postgres)
      </span>
    </p>
  );
}
