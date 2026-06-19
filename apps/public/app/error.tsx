"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire this to Sentry (scope §13) when error tracking is added.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        An unexpected error occurred on our end. Please try again — if it keeps
        happening, let us know.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full bg-action px-7 text-base font-bold text-white transition-colors duration-300 hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Try again
        </button>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
