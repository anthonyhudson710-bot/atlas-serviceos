// Server-side instrumentation entrypoint. Next.js calls register() once per
// server instance; we load the runtime-specific Sentry config accordingly.
// onRequestError forwards server render/route/action errors to Sentry.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
