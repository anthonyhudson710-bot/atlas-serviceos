"use client";

// Global error boundary — catches errors thrown in the root layout/template,
// which the route-level error.tsx cannot reach. Replaces the entire document,
// so it ships its own <html>/<body> and inline styles. Reports to Sentry.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0b2370",
          color: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, margin: 0 }}>
          Something went wrong.
        </h1>
        <p style={{ maxWidth: "28rem", opacity: 0.8, margin: 0 }}>
          An unexpected error occurred. The team has been notified.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: "0.5rem",
            height: "2.75rem",
            padding: "0 1.75rem",
            borderRadius: "9999px",
            border: "none",
            background: "#ffffff",
            color: "#0b2370",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
