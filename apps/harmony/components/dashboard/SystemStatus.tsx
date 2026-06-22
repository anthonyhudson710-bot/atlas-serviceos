"use client";

// Live platform health for the dashboard. Polls the API's /status aggregator,
// renders real per-component state + latency, and handles loading / degraded /
// outage / stale / unreachable. No fabricated uptime — only point-in-time data.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowsClockwise,
  CheckCircle,
  Circle,
  Clock,
  WarningCircle,
  WarningOctagon,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.atlasfsm.com";
const POLL_MS = 30_000;
const STALE_SECONDS = 120;

type ComponentState = "operational" | "degraded" | "down" | "unknown";
type Overall = "operational" | "degraded" | "down";

interface StatusComponent {
  key: string;
  label: string;
  critical: boolean;
  state: ComponentState;
  latencyMs: number | null;
  detail: string | null;
}
interface StatusPayload {
  environment: string;
  overall: Overall;
  checkedAt: string;
  components: StatusComponent[];
}

const STATE_ICON: Record<ComponentState, Icon> = {
  operational: CheckCircle,
  degraded: WarningCircle,
  down: XCircle,
  unknown: Circle,
};
const STATE_COLOR: Record<ComponentState, string> = {
  operational: "text-success",
  degraded: "text-warning",
  down: "text-error",
  unknown: "text-muted-2",
};
const OVERALL_LABEL: Record<Overall, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Major outage",
};
const OVERALL_BADGE: Record<Overall, string> = {
  operational: "bg-success/10 text-success",
  degraded: "bg-warning/10 text-warning",
  down: "bg-error/10 text-error",
};

function agoLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.round(seconds / 60)} min ago`;
}

export function SystemStatus() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Seconds since the last successful fetch — drives "checked … ago" + staleness
  // without calling impure Date.now() during render (Next 16 React Compiler).
  const [secondsAgo, setSecondsAgo] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/status`, {
        credentials: "include",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      setData((await res.json()) as StatusPayload);
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
    // Deferred so the first fetch's setState isn't synchronous within the effect.
    const initial = setTimeout(() => void load(), 0);
    const poll = setInterval(() => void load(), POLL_MS);
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(initial);
      clearInterval(poll);
      window.removeEventListener("focus", onFocus);
      abortRef.current?.abort();
    };
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const stale = !!data && secondsAgo > STALE_SECONDS;
  const downNonCritical = data
    ? data.components.filter((c) => !c.critical && c.state === "down")
    : [];

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-foreground">System status</h2>
            {data &&
              (stale ? (
                <span className="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted-2">
                  Last known: {OVERALL_LABEL[data.overall]}
                </span>
              ) : (
                <OverallBadge overall={data.overall} />
              ))}
            {loading && !data && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted-2">
                <ArrowsClockwise size={12} className="animate-spin" aria-hidden="true" />
                Checking…
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-2">
            Platform · shared stack
            {data && data.environment !== "production" ? ` · ${data.environment}` : ""}
          </p>
        </div>

        {data && (
          <div className="flex shrink-0 flex-col items-end gap-1">
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowsClockwise
                size={15}
                weight="bold"
                aria-hidden="true"
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <span className="inline-flex items-center gap-1 text-xs text-muted-2">
              <Clock size={13} aria-hidden="true" />
              Checked {agoLabel(secondsAgo)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      {loading && !data ? (
        <SkeletonRows />
      ) : error && !data ? (
        <Unreachable onRetry={() => void load()} />
      ) : data ? (
        <>
          {stale && (
            <p className="mt-4 rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
              Data may be stale — last successful check {agoLabel(secondsAgo)}.
            </p>
          )}
          <ul className="mt-3">
            {data.components.map((c) => (
              <StatusRow key={c.key} component={c} />
            ))}
          </ul>
          {data.overall === "degraded" && downNonCritical.length > 0 && (
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
              <WarningCircle size={15} weight="fill" aria-hidden="true" />
              {downNonCritical.length} non-critical{" "}
              {downNonCritical.length === 1 ? "service" : "services"} down · core
              platform (API + Database) unaffected
            </p>
          )}
        </>
      ) : null}
    </Card>
  );
}

function OverallBadge({ overall }: { overall: Overall }) {
  const Glyph = overall === "operational" ? CheckCircle : overall === "degraded" ? WarningCircle : XCircle;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${OVERALL_BADGE[overall]}`}
    >
      <Glyph size={13} weight="fill" aria-hidden="true" />
      {OVERALL_LABEL[overall]}
    </span>
  );
}

function StatusRow({ component: c }: { component: StatusComponent }) {
  const Glyph = STATE_ICON[c.state];
  const stateWord =
    c.state === "down"
      ? "down"
      : c.state === "degraded"
        ? "degraded"
        : c.state === "unknown"
          ? "not monitored"
          : "operational";
  return (
    <li className="flex items-center justify-between gap-4 border-t border-border-subtle py-3 first:border-t-0">
      <div className="flex min-w-0 items-center gap-3">
        <Glyph
          size={20}
          weight={c.state === "unknown" ? "regular" : "fill"}
          className={STATE_COLOR[c.state]}
          aria-hidden="true"
        />
        <span className="font-medium text-foreground">{c.label}</span>
        {c.critical && (
          <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-2">
            Critical
          </span>
        )}
      </div>
      <div className="shrink-0 text-right text-sm">
        {c.detail ? (
          <span className={`${STATE_COLOR[c.state]} font-medium`}>{c.detail}</span>
        ) : c.latencyMs !== null ? (
          <span className="tabular-nums text-muted-2">{c.latencyMs.toLocaleString()} ms</span>
        ) : (
          <span className="text-muted-2">—</span>
        )}
      </div>
      <span className="sr-only">
        {c.label}: {stateWord}
        {c.detail ? ` — ${c.detail}` : c.latencyMs !== null ? ` — ${c.latencyMs} ms` : ""}
      </span>
    </li>
  );
}

function SkeletonRows() {
  return (
    <ul className="mt-3" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <li
          key={i}
          className="flex items-center justify-between gap-4 border-t border-border-subtle py-3 first:border-t-0"
        >
          <div className="flex items-center gap-3">
            <span className="size-5 animate-pulse rounded-full bg-surface-2" />
            <span className="h-4 w-28 animate-pulse rounded bg-surface-2" />
          </div>
          <span className="h-4 w-12 animate-pulse rounded bg-surface-2" />
        </li>
      ))}
    </ul>
  );
}

function Unreachable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-4 flex flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <WarningOctagon size={20} weight="fill" className="text-error" aria-hidden="true" />
        <span className="font-bold text-foreground">Can&apos;t reach status service</span>
      </div>
      <p className="text-sm text-muted">
        The <code className="rounded px-1 font-mono">/status</code> endpoint didn&apos;t
        respond. The API may be down or unreachable from your network.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ArrowsClockwise size={15} weight="bold" aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
