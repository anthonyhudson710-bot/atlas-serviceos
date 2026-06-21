// Sentry initialization for the Edge runtime (middleware, edge routes).
// Loaded by instrumentation.ts via register() when NEXT_RUNTIME === "edge".
import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ??
    "https://2a2d9fd1fbfe145a8a2852c0f65fb7c9@o4511600165388288.ingest.us.sentry.io/4511600430088192",

  // Isolate dev vs prod in Sentry; NODE_ENV is "development" under `next dev`
  // and "production" in the Docker/standalone build. (The edge runtime has no
  // built-in NODE_ENV fallback, so setting it here is what makes dev events
  // land in the development environment.)
  environment: process.env.NODE_ENV,

  tracesSampleRate: isProd ? 0.1 : 1,

  enableLogs: true,

  // Sentry is ON in prod, OFF in dev by default. Flip per environment with
  // NEXT_PUBLIC_SENTRY_ENABLED = "true" | "false" — e.g. "true" to debug a bug
  // in dev, "false" to silence dev noise (set it, then restart the dev server).
  enabled:
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true" ||
    (process.env.NEXT_PUBLIC_SENTRY_ENABLED !== "false" && isProd),

  debug: false,
});
