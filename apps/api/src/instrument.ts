// Sentry initialization for the API. MUST be imported before NestJS (and any
// instrumented module) so the SDK can patch http/express/pg first — see the
// import order in main.ts.
import * as Sentry from "@sentry/nestjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  // Public client key for the serviceos-api project. Override with SENTRY_DSN.
  dsn:
    process.env.SENTRY_DSN ??
    "https://c394f5b3ffef897672402b7fcc7bcf2d@o4511600165388288.ingest.us.sentry.io/4511604751925248",

  // Isolate dev vs prod. NODE_ENV is "production" in the Docker image.
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",

  // Full tracing in dev, sampled in prod to keep quota in check.
  tracesSampleRate: isProd ? 0.1 : 1,

  // Forward structured logs to Sentry.
  enableLogs: true,

  // Sentry is ON in prod, OFF in dev by default. Flip with SENTRY_ENABLED =
  // "true" | "false" — e.g. "true" to debug in dev, "false" to silence noise.
  enabled:
    process.env.SENTRY_ENABLED === "true" ||
    (process.env.SENTRY_ENABLED !== "false" && isProd),

  debug: false,
});
