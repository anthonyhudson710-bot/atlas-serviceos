import type { ReactNode } from "react";

/**
 * Vertical rhythm + optional tinted background for page sections.
 * `labelledby` ties the <section> to its heading id for screen readers.
 */
export function Section({
  id,
  surface = false,
  labelledby,
  className = "",
  children,
}: {
  id?: string;
  surface?: boolean;
  labelledby?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledby}
      className={`py-20 sm:py-28 ${surface ? "bg-surface" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
