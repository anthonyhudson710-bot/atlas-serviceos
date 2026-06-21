import type { Metadata } from "next";
import { SentryTestClient } from "./sentry-test-client";

// Keep this verification page out of search results.
export const metadata: Metadata = {
  title: "Sentry test",
  robots: { index: false, follow: false },
};

export default function SentryTestPage() {
  return <SentryTestClient />;
}
