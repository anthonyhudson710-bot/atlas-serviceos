import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

export type ComponentState = "operational" | "degraded" | "down" | "unknown";
export type Overall = "operational" | "degraded" | "down";

export interface StatusComponent {
  key: string;
  label: string;
  critical: boolean;
  state: ComponentState;
  latencyMs: number | null;
  detail: string | null;
}

export interface StatusResult {
  environment: string;
  overall: Overall;
  checkedAt: string;
  components: StatusComponent[];
}

function envInt(name: string, fallback: number): number {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

/**
 * Live health aggregator for the Harmony "System status" widget. Every signal is
 * a real, point-in-time check — no fabricated uptime. Results are cached briefly
 * so polling clients don't hammer the internal services.
 *
 * Environment-aware: the database + API are always checked; the sibling web
 * services are only probed in production (where they run on the compose network)
 * unless their STATUS_TARGET_* URL is explicitly set, otherwise they report
 * "unknown" rather than a misleading "down" in local dev.
 */
@Injectable()
export class StatusService {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  private cache: { at: number; result: StatusResult } | null = null;
  private readonly cacheTtlMs = 10_000;

  async getStatus(): Promise<StatusResult> {
    const now = Date.now();
    if (this.cache && now - this.cache.at < this.cacheTtlMs) {
      return this.cache.result;
    }
    const result = await this.runChecks();
    this.cache = { at: now, result };
    return result;
  }

  private async runChecks(): Promise<StatusResult> {
    const isProd = process.env.NODE_ENV === "production";
    const environment =
      process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development";
    const dbWarn = envInt("STATUS_DB_WARN_MS", 150);
    const webWarn = envInt("STATUS_WEB_WARN_MS", 800);
    const timeoutMs = envInt("STATUS_TIMEOUT_MS", 3000);
    const port = process.env.PORT ?? "3000";

    const webTargets = [
      { key: "web_app", label: "App console", env: "STATUS_TARGET_APP", def: "http://app:3000/robots.txt" },
      { key: "web_harmony", label: "Admin console", env: "STATUS_TARGET_HARMONY", def: "http://harmony:3000/robots.txt" },
      { key: "web_public", label: "Marketing site", env: "STATUS_TARGET_PUBLIC", def: "http://public:3000/" },
    ];

    const components = await Promise.all([
      this.checkDb(dbWarn, timeoutMs),
      this.checkHttp("api", "API", `http://127.0.0.1:${port}/health`, webWarn, timeoutMs, true),
      ...webTargets.map((t) => {
        const override = process.env[t.env];
        const url = override !== undefined ? override : isProd ? t.def : "";
        if (!url) {
          return Promise.resolve<StatusComponent>({
            key: t.key,
            label: t.label,
            critical: false,
            state: "unknown",
            latencyMs: null,
            detail: isProd ? "Not configured" : "Not monitored in this environment",
          });
        }
        return this.checkHttp(t.key, t.label, url, webWarn, timeoutMs, false);
      }),
    ]);

    return {
      environment,
      overall: this.rollup(components),
      checkedAt: new Date().toISOString(),
      components,
    };
  }

  private rollup(components: StatusComponent[]): Overall {
    const critical = components.filter((c) => c.critical);
    if (critical.some((c) => c.state === "down")) return "down";
    if (
      components.some((c) => c.state === "degraded") ||
      components.some((c) => !c.critical && c.state === "down") ||
      critical.some((c) => c.state === "unknown")
    ) {
      return "degraded";
    }
    return "operational";
  }

  private async checkDb(warnMs: number, timeoutMs: number): Promise<StatusComponent> {
    const start = Date.now();
    try {
      await this.withTimeout(this.db.query("SELECT 1"), timeoutMs);
      const latencyMs = Date.now() - start;
      return {
        key: "database",
        label: "Database",
        critical: true,
        state: latencyMs > warnMs ? "degraded" : "operational",
        latencyMs,
        detail: latencyMs > warnMs ? `Slow — responded in ${latencyMs.toLocaleString()} ms` : null,
      };
    } catch (err) {
      return {
        key: "database",
        label: "Database",
        critical: true,
        state: "down",
        latencyMs: null,
        detail: this.failureDetail(err, timeoutMs),
      };
    }
  }

  private async checkHttp(
    key: string,
    label: string,
    url: string,
    warnMs: number,
    timeoutMs: number,
    critical: boolean,
  ): Promise<StatusComponent> {
    const start = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      const latencyMs = Date.now() - start;
      if (!res.ok) {
        return { key, label, critical, state: "degraded", latencyMs, detail: `Unexpected status ${res.status}` };
      }
      return {
        key,
        label,
        critical,
        state: latencyMs > warnMs ? "degraded" : "operational",
        latencyMs,
        detail: latencyMs > warnMs ? `Slow — responded in ${latencyMs.toLocaleString()} ms` : null,
      };
    } catch (err) {
      return { key, label, critical, state: "down", latencyMs: null, detail: this.failureDetail(err, timeoutMs) };
    } finally {
      clearTimeout(timer);
    }
  }

  private failureDetail(err: unknown, timeoutMs: number): string {
    const e = err as { name?: string; code?: string; message?: string };
    if (e?.name === "AbortError" || e?.name === "TimeoutError") {
      return `Connection timed out after ${Math.round(timeoutMs / 1000)}s`;
    }
    if (e?.code === "ECONNREFUSED" || /ECONNREFUSED|refused/i.test(e?.message ?? "")) {
      return "Connection refused";
    }
    return e?.message ?? "Unreachable";
  }

  private withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(Object.assign(new Error("timeout"), { name: "TimeoutError" })),
        ms,
      );
      p.then(
        (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        (e) => {
          clearTimeout(timer);
          reject(e);
        },
      );
    });
  }
}
