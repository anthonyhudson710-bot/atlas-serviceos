// Sentry initialization for the Node.js server runtime. Loaded by
// instrumentation.ts via register() when NEXT_RUNTIME === "nodejs".
// See https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  // Public client key. Override per-environment with NEXT_PUBLIC_SENTRY_DSN.
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ??
    "https://987f614198c087c5c231c5cdc64e73ce@o4511600165388288.ingest.us.sentry.io/4511600436772864",

  // Isolate dev vs prod in Sentry; NODE_ENV is "development" under `next dev`
  // and "production" in the Docker/standalone build.
  environment: process.env.NODE_ENV,

  // Full tracing in dev, sampled in prod to keep quota in check.
  tracesSampleRate: isProd ? 0.1 : 1,

  // Forward console/structured logs to Sentry.
  enableLogs: true,

  // Set to true locally to debug the SDK itself.
  debug: false,
});
