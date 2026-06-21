"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { NavLeaf } from "@/lib/app";

/**
 * Small header dropdown: an icon/avatar trigger and a panel anchored beneath it.
 * Closes on Escape, an outside pointer-down, or when an item calls `close`.
 * Shared by the Topbar's quick-add (+) and profile menus.
 */
export function HeaderMenu({
  label,
  trigger,
  triggerClassName,
  align = "right",
  children,
}: {
  label: string;
  trigger: ReactNode;
  triggerClassName: string;
  align?: "left" | "right";
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className={`absolute top-full z-50 mt-2 min-w-56 overflow-hidden rounded-xl border border-border bg-background py-1 shadow-overlay ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

/** A nav leaf rendered as a menu row; disabled leaves show a muted "Soon" tag. */
export function MenuLeaf({
  leaf,
  onNavigate,
}: {
  leaf: NavLeaf;
  onNavigate: () => void;
}) {
  if (leaf.disabled) {
    return (
      <span
        aria-disabled="true"
        className="flex items-center justify-between gap-6 px-3 py-2 text-sm text-muted/70"
      >
        {leaf.label}
        <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-2">
          Soon
        </span>
      </span>
    );
  }
  return (
    <Link
      href={leaf.href}
      role="menuitem"
      onClick={onNavigate}
      className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
    >
      {leaf.label}
    </Link>
  );
}
