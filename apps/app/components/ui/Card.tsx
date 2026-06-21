import type { ReactNode } from "react";

/** White, gently-rounded surface with the evermore tinted elevation. */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-card border border-border-subtle bg-background shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
