import type { ReactNode } from "react";
import { AppNav } from "@/components/app-shell/AppNav";
import { Topbar } from "@/components/app-shell/Topbar";
import { MobileNavProvider } from "@/components/app-shell/nav-context";

/**
 * The console frame: a fixed full-height shell with a light global header across
 * the top, and below it the collapsible left sidebar beside an independently
 * scrolling workspace. Mounted once in the root layout so every route renders
 * inside it. Below `lg` the sidebar is off-canvas behind the header's burger —
 * the provider shares that open state across the two. `isolate` keeps the
 * sidebar stacked beneath the header.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MobileNavProvider>
      <div className="ac-shell">
        <Topbar />
        <div className="isolate flex min-h-0 flex-1">
          <AppNav />
          <main
            id="main"
            className="ac-scroll min-w-0 flex-1 overflow-y-auto bg-[var(--color-bg-page)]"
          >
            {children}
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
