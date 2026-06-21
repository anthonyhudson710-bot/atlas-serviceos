"use client";

import { List, X } from "@phosphor-icons/react";
import { useMobileNav } from "@/components/app-shell/nav-context";

/**
 * Burger that toggles the off-canvas rail on mobile. Hidden at lg+, where the
 * rail is always on screen. Lives at the left of the Topbar; the header stays
 * above the drawer, so this stays tappable to close (and shows an X while open).
 */
export function MobileMenuButton() {
  const { open, setOpen } = useMobileNav();
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      className="grid size-10 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground lg:hidden"
    >
      {open ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}
    </button>
  );
}
