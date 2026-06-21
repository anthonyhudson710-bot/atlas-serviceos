// Sentry initialization for the browser. Next.js runs this file before
// React hydration (see node_modules/next/dist/docs .../instrumentation-client.md).
import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ??
    "https://987f614198c087c5c231c5cdc64e73ce@o4511600165388288.ingest.us.sentry.io/4511600436772864",

  // Isolate dev vs prod in Sentry; NODE_ENV is "development" under `next dev`
  // and "production" in the Docker/standalone build.
  environment: process.env.NODE_ENV,

  tracesSampleRate: isProd ? 0.1 : 1,

  // Session Replay: every session in dev (for testing), 10% in prod, plus
  // every session that hits an error. maskAllText/blockAllMedia are off, so
  // replays record on-screen text and media (form inputs still stay masked via
  // the maskAllInputs default).
  replaysSessionSampleRate: isProd ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,

  integrations: [
    Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
  ],

  // Sentry is ON in prod, OFF in dev by default. Flip per environment with
  // NEXT_PUBLIC_SENTRY_ENABLED = "true" | "false" — e.g. "true" to debug a bug
  // in dev, "false" to silence dev noise (set it, then restart the dev server).
  enabled:
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true" ||
    (process.env.NEXT_PUBLIC_SENTRY_ENABLED !== "false" && isProd),

  debug: false,
});

// Lets Sentry instrument App Router client-side navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
