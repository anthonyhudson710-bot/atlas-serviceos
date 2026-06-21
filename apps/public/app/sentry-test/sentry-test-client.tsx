"use client";

// Sentry verification UI for the marketing site. Open /sentry-test in dev and
// prod and trigger each error type to confirm events reach the serviceos-public
// Sentry project. Safe to delete once monitoring is verified.
import { useState } from "react";
import { Container } from "@/components/ui/Container";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-7 text-base font-bold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const primary = `${base} bg-action text-white hover:bg-action-hover`;
const secondary = `${base} border border-line bg-white text-action hover:bg-action hover:text-white`;

export function SentryTestClient() {
  const [boom, setBoom] = useState(false);
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  // Render-time throw: trips the route error boundary (app/error.tsx), which
  // reports to Sentry from its useEffect.
  if (boom) {
    throw new Error("Sentry test — public render error (error-boundary path)");
  }

  return (
    <Container className="py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Sentry test
      </h1>
      <p className="mt-2 max-w-prose text-muted">
        Throw errors on purpose to confirm they reach Sentry. Safe to remove once
        verified.
      </p>

      <div className="mt-10 flex max-w-xl flex-col gap-8">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">Client error (uncaught)</h2>
          <p className="text-sm text-muted">
            Throws inside an event handler — caught by the browser SDK&apos;s
            global handler. The page stays put; check Sentry for the issue.
          </p>
          <div>
            <button
              type="button"
              className={primary}
              onClick={() => {
                throw new Error(
                  "Sentry test — public client error (uncaught handler)",
                );
              }}
            >
              Throw client error
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2 border-t border-line pt-8">
          <h2 className="text-lg font-bold text-foreground">Render error (error boundary)</h2>
          <p className="text-sm text-muted">
            Forces a render-time throw, tripping app/error.tsx, which reports to
            Sentry.
          </p>
          <div>
            <button type="button" className={secondary} onClick={() => setBoom(true)}>
              Throw render error
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2 border-t border-line pt-8">
          <h2 className="text-lg font-bold text-foreground">Server error</h2>
          <p className="text-sm text-muted">
            Calls a route handler that throws on the server — captured via
            instrumentation.ts&apos;s onRequestError. You can also open{" "}
            <code className="rounded px-1 font-mono">/api/sentry-test</code>{" "}
            directly.
          </p>
          <div>
            <button
              type="button"
              className={secondary}
              onClick={async () => {
                setServerStatus("Triggering…");
                try {
                  const res = await fetch("/api/sentry-test");
                  setServerStatus(
                    `Server responded ${res.status} — check Sentry for the issue.`,
                  );
                } catch {
                  setServerStatus("Request failed — check Sentry.");
                }
              }}
            >
              Throw server error
            </button>
          </div>
          {serverStatus && <p className="text-sm text-muted">{serverStatus}</p>}
        </section>
      </div>
    </Container>
  );
}
