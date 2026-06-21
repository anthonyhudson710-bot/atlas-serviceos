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
          background: "#ffffff",
          color: "#0b2370",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, margin: 0 }}>
          Something went wrong.
        </h1>
        <p
          style={{
            maxWidth: "28rem",
            margin: 0,
            color: "#5b6478",
          }}
        >
          An unexpected error occurred on our end. Please try again — if it
          keeps happening, let us know.
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
            background: "#0b2370",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
