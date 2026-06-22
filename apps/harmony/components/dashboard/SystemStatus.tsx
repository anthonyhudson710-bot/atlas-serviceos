"use client";

// Live platform health for the dashboard. Polls the API's /status aggregator,
// renders real per-component state + latency, and handles loading / degraded /
// outage / stale / unreachable. No fabricated uptime — only point-in-time data.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowsClockwise,
  CheckCircle,
  Circle,
  CircleNotch,
  Clock,
  Info,
  WarningCircle,
  WifiSlash,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";

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
  operational: "var(--green-600)",
  degraded: "var(--amber-500)",
  down: "var(--red-500)",
  unknown: "var(--color-text-tertiary)",
};
const OVERALL_LABEL: Record<Overall, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Major outage",
};
const OVERALL_CHIP: Record<Overall, string> = {
  operational: "s-active",
  degraded: "s-pastdue",
  down: "s-danger",
};
const OVERALL_ICON: Record<Overall, Icon> = {
  operational: CheckCircle,
  degraded: WarningCircle,
  down: XCircle,
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
    <div className="ac-card ac-pad">
      {/* Header */}
      <div className="ac-cardh items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="ac-cardt">System status</span>
            {data &&
              (stale ? (
                <span className="ac-chip s-neutral">Last known: {OVERALL_LABEL[data.overall]}</span>
              ) : (
                <OverallBadge overall={data.overall} />
              ))}
            {loading && !data && (
              <span className="ac-chip s-neutral">
                <CircleNotch size={12} className="ac-spin" aria-hidden="true" />
                Checking…
              </span>
            )}
          </div>
          <p className="ac-tert mt-[3px] text-[11px]">
            Platform · shared stack
            {data && data.environment !== "production" ? ` · ${data.environment}` : ""}
          </p>
        </div>

        {data && (
          <div className="flex shrink-0 flex-col items-end gap-1">
            {refreshing ? (
              <button type="button" className="ac-btn b-ghost sm cursor-default opacity-60" disabled>
                <CircleNotch size={13} className="ac-spin" aria-hidden="true" />
                Refreshing…
              </button>
            ) : (
              <button type="button" onClick={() => void load()} className="ac-btn b-ghost sm">
                <ArrowsClockwise size={13} aria-hidden="true" />
                Refresh
              </button>
            )}
            <span className="ac-tert flex items-center gap-[5px] text-[11px]">
              <Clock size={12} aria-hidden="true" />
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
            <div className="mb-[10px] flex items-center gap-2 rounded-md border border-[var(--amber-200)] bg-[var(--amber-50)] px-[10px] py-[7px] text-[11.5px] font-medium text-[var(--color-text-warning)]">
              <Clock size={14} weight="fill" aria-hidden="true" className="shrink-0" />
              Data may be stale — last successful check {agoLabel(secondsAgo)}.
            </div>
          )}
          <div role="list">
            {data.components.map((c) => (
              <StatusRow key={c.key} component={c} />
            ))}
          </div>
          {data.overall === "degraded" && downNonCritical.length > 0 && (
            <div className="mt-[11px] flex items-start gap-[7px] rounded-md border border-[var(--amber-200)] bg-[var(--amber-50)] px-[10px] py-[7px] text-[11.5px] leading-[1.45] text-[var(--color-text-secondary)]">
              <Info
                size={13}
                weight="fill"
                aria-hidden="true"
                className="mt-px shrink-0 text-[var(--color-text-warning)]"
              />
              {downNonCritical.length} non-critical{" "}
              {downNonCritical.length === 1 ? "service" : "services"} down · core platform (API +
              Database) unaffected
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

function OverallBadge({ overall }: { overall: Overall }) {
  const Glyph = OVERALL_ICON[overall];
  return (
    <span className={`ac-chip ${OVERALL_CHIP[overall]}`}>
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
    <div
      className="ac-ssrow"
      role="listitem"
      aria-label={`${c.label}: ${stateWord}${
        c.detail ? ` — ${c.detail}` : c.latencyMs !== null ? ` — ${c.latencyMs} ms` : ""
      }`}
    >
      <Glyph
        size={16}
        weight={c.state === "unknown" ? "regular" : "fill"}
        style={{ color: STATE_COLOR[c.state] }}
        className="shrink-0"
        aria-hidden="true"
      />
      <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{c.label}</span>
      {c.critical && <span className="ac-crit">Critical</span>}
      <span className="flex-1" />
      {c.detail ? (
        <span
          className="ac-mono max-w-[160px] text-right text-[11px] font-semibold leading-[1.35]"
          style={{ color: STATE_COLOR[c.state] }}
        >
          {c.detail}
        </span>
      ) : c.latencyMs !== null ? (
        <span className="ac-mono ac-tert text-[12px]">{c.latencyMs.toLocaleString()} ms</span>
      ) : (
        <span className="ac-tert">—</span>
      )}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="ac-ssrow">
          <span className="ac-sk size-4 shrink-0 rounded-full" />
          <span className="ac-sk h-[11px] w-[100px]" />
          <span className="flex-1" />
          <span className="ac-sk h-[10px] w-[44px]" />
        </div>
      ))}
    </div>
  );
}

function Unreachable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 pt-1">
      <div className="flex gap-[10px]">
        <WifiSlash
          size={20}
          weight="fill"
          className="mt-px shrink-0 text-[var(--color-text-danger)]"
          aria-hidden="true"
        />
        <div>
          <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">
            Can&apos;t reach status service
          </div>
          <p className="ac-muted mt-[3px] text-[12px] leading-[1.5]">
            The <code className="ac-mono">/status</code> endpoint didn&apos;t respond. The API may be
            down or unreachable from your network.
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
