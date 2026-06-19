import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";

// Pill control (evermore signature): Midnight base → Signal hover, weight 700.
const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-7 text-base font-bold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const variants: Record<Variant, string> = {
  primary: "bg-action text-white hover:bg-action-hover",
  // evermore "white" variant: white base → Midnight on hover.
  secondary: "border border-line bg-white text-action hover:bg-action hover:text-white",
};

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
