import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-foreground hover:bg-brand-strong",
  secondary:
    "border border-border bg-background text-foreground hover:bg-surface-2",
};

/**
 * Link styled as a button — the only CTA control on a link-driven page.
 * Uses next/link so internal routes get client navigation + prefetch; it
 * renders a plain anchor for hash/external/mailto hrefs too.
 */
export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
