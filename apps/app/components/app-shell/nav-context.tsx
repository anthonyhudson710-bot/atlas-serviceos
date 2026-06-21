"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shares the mobile-drawer open state between the burger trigger (in the Topbar)
 * and the off-canvas rail (AppNav), which live in different branches of the tree.
 * Desktop ignores it — the rail is always visible there.
 */
type MobileNavValue = { open: boolean; setOpen: (open: boolean) => void };

const MobileNavContext = createContext<MobileNavValue | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <MobileNavContext.Provider value={{ open, setOpen }}>{children}</MobileNavContext.Provider>;
}

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) throw new Error("useMobileNav must be used within <MobileNavProvider>");
  return ctx;
}
