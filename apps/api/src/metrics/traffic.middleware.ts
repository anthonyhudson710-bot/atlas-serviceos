import type { NextFunction, Request, Response } from "express";
import { TrafficMetricsService } from "./traffic-metrics.service";

/**
 * Records every (non-internal) request into the rolling-window metrics on
 * response finish — so it captures the FINAL status code (after guards/filters)
 * and the full handling latency, for successes and errors alike.
 *
 * Internal observability endpoints (/health, /status, /metrics) and CORS
 * preflights are excluded so the dashboard's own polling + the Docker liveness
 * probe don't drown out real API traffic in a low-volume window.
 */
export function trafficMiddleware(metrics: TrafficMetricsService) {
  const excluded = (path: string) =>
    TrafficMetricsService.excludes.some((p) => path === p || path.startsWith(`${p}/`));

  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === "OPTIONS" || excluded(req.path)) {
      next();
      return;
    }
    const start = process.hrtime.bigint();
    res.on("finish", () => {
      const latencyMs = Number(process.hrtime.bigint() - start) / 1e6;
      // req.route is populated by Express once a route matches; unmatched → 404s.
      const route = (req.route?.path as string | undefined) ?? "unmatched";
      metrics.record({ statusCode: res.statusCode, latencyMs, route, method: req.method });
    });
    next();
  };
}
