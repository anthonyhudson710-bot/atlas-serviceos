import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

// Content Security Policy. 'unsafe-inline' is still required for Next's
// hydration bootstrap and inline styles; tighten to nonces later. Harmony is a
// private admin console, so it ships no third-party scripts (no analytics).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Sentry browser SDK / Session Replay POST events to the ingest endpoint.
  "connect-src 'self' https://*.ingest.us.sentry.io",
  // Session Replay compresses payloads in a blob-backed web worker.
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// The CSP and HSTS are PRODUCTION-ONLY. `next dev` runs as plain HTTP on the LAN
// and its Fast Refresh / HMR runtime relies on eval + a websocket — a strict CSP
// blocks all of that, leaving the page unstyled and non-interactive (e.g. the
// mobile nav burger does nothing). The deployed image (NODE_ENV=production, behind
// Caddy's TLS) still gets the full strict policy. The headers below are harmless
// in dev, so they apply in both.
const securityHeaders = [
  ...(isProd
    ? [
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ]
    : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Self-contained server bundle at .next/standalone → tiny runtime image.
  output: "standalone",
  // Scope file tracing to this app even with sibling apps under ../.
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withSentryConfig(nextConfig, {
  // Source-map upload + release management. Org/project/token come from the
  // build environment; uploads are skipped when SENTRY_AUTH_TOKEN is absent so
  // local/CI builds without the token still succeed (errors just stay minified).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },

  // Only print plugin output in CI.
  silent: !process.env.CI,

  // Upload a wider set of client bundles for more complete stack traces.
  widenClientFileUpload: true,
});
