import type { NextFunction, Request, Response } from "express";
import { TrafficMetricsService } from "./traffic-metrics.service";

// User-agents that are obviously automated. Not exhaustive — bot detection is a
// heuristic, surfaced as such in the UI.
const BOT_RE =
  /bot\b|bot\/|crawl|spider|slurp|scanner|monitor|uptime|pingdom|headless|phantom|curl\/|wget|python-requests|python-urllib|go-http-client|libwww|okhttp|axios\/|node-fetch|\bjava\/|scrapy|semrush|ahrefs|censys|masscan|zgrab|nmap|nuclei|httpx|facebookexternalhit|claudebot|gptbot|oai-searchbot|chatgpt|ccbot|bytespider|petalbot|googlebot|bingbot|yandex|duckduckbot|baiduspider|applebot|amazonbot|mj12bot|dotbot|expanse|internet-measurement/i;
const BROWSER_RE = /mozilla|applewebkit|gecko|safari|chrome|firefox|edg|opera/i;

function isBot(ua: string): boolean {
  if (!ua.trim()) return true; // no UA → automated
  if (BOT_RE.test(ua)) return true;
  return !BROWSER_RE.test(ua); // anything that doesn't announce a browser engine
}

// The real client IP, working back from Cloudflare → Caddy → app. CF-Connecting-IP
// is authoritative when proxied through Cloudflare; X-Forwarded-For is the fallback.
function clientIp(req: Request): string {
  const cf = req.headers["cf-connecting-ip"];
  if (typeof cf === "string" && cf) return cf;
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

/**
 * Records every (non-internal) request into the rolling window on response
 * finish — final status, full latency, route, plus client attribution (IP, UA,
 * bot heuristic) so the dashboard can show who is hitting the API.
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
      const route = (req.route?.path as string | undefined) ?? "unmatched";
      const uaHeader = req.headers["user-agent"];
      const ua = (typeof uaHeader === "string" ? uaHeader : "").slice(0, 200);
      metrics.record({
        statusCode: res.statusCode,
        latencyMs,
        route,
        method: req.method,
        ip: clientIp(req),
        ua,
        bot: isBot(ua),
      });
    });
    next();
  };
}
