import { Warning } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Shared shell for legal pages. The draft banner is deliberate and honest —
 * these are working templates, NOT counsel-reviewed documents (see scope §11).
 */
export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>

      <div
        role="note"
        className="mt-6 flex gap-3 rounded-card border border-border bg-surface-2 p-4 text-sm text-foreground"
      >
        <Warning size={20} weight="fill" className="mt-0.5 shrink-0 text-steel" aria-hidden="true" />
        <p>
          <strong>Draft template — pending legal review.</strong> This document is a
          starting point and must be reviewed by qualified counsel before launch. It
          is not yet a binding agreement.
        </p>
      </div>

      <div className="mt-10 space-y-5 leading-7 text-muted [&_a]:text-signal [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:mt-1 [&_p]:text-muted [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </Container>
  );
}
