"use client";

// Sentry verification page. Open /sentry-test in dev and prod and trigger each
// error type to confirm events reach the serviceos-app Sentry project. Safe to
// delete once monitoring is verified.
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SentryTestPage() {
  const [boom, setBoom] = useState(false);
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  // Render-time throw: trips the nearest error boundary (app/global-error.tsx),
  // which reports to Sentry from its useEffect.
  if (boom) {
    throw new Error("Sentry test — app render error (error-boundary path)");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader
        title="Sentry test"
        description="Throw errors on purpose to confirm they reach Sentry. Safe to remove once verified."
      />

      <Card className="mt-8 flex flex-col gap-6 p-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">Client error (uncaught)</h2>
          <p className="text-sm text-muted">
            Throws inside an event handler — caught by the browser SDK&apos;s
            global handler. The page stays put; check Sentry for the issue.
          </p>
          <div>
            <Button
              onClick={() => {
                throw new Error(
                  "Sentry test — app client error (uncaught handler)",
                );
              }}
            >
              Throw client error
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-2 border-t border-border-subtle pt-6">
          <h2 className="text-lg font-bold text-foreground">Render error (error boundary)</h2>
          <p className="text-sm text-muted">
            Forces a render-time throw, tripping app/global-error.tsx, which
            reports to Sentry.
          </p>
          <div>
            <Button variant="secondary" onClick={() => setBoom(true)}>
              Throw render error
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-2 border-t border-border-subtle pt-6">
          <h2 className="text-lg font-bold text-foreground">Server error</h2>
          <p className="text-sm text-muted">
            Calls a route handler that throws on the server — captured via
            instrumentation.ts&apos;s onRequestError. You can also open{" "}
            <code className="rounded bg-surface-2 px-1">/api/sentry-test</code>{" "}
            directly.
          </p>
          <div>
            <Button
              variant="secondary"
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
            </Button>
          </div>
          {serverStatus && <p className="text-sm text-muted">{serverStatus}</p>}
        </section>
      </Card>
    </div>
  );
}
