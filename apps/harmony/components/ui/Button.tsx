import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

// Pill control (evermore signature): Midnight base → Signal hover, weight 700.
// `sm` is the topbar/table density; the default matches apps/public.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50";

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-7 text-base",
} as const;

const variants: Record<Variant, string> = {
  primary: "bg-action text-white hover:bg-action-hover",
  secondary: "border border-border bg-background text-action hover:bg-action hover:text-white",
};

type CommonProps = {
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
