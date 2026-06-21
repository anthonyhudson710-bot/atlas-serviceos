import type { ReactNode } from "react";
import { AppNav } from "@/components/app-shell/AppNav";
import { Topbar } from "@/components/app-shell/Topbar";
import { MobileNavProvider } from "@/components/app-shell/nav-context";

/**
 * The console frame: a full-width sticky Topbar across the top, and below it the
 * Midnight icon rail (with its flyout sheet) beside the scrollable workspace.
 * Mounted once in the root layout so every route renders inside it. On mobile
 * the rail collapses behind the Topbar's burger — the provider shares that open
 * state across the two. `isolate` keeps the rail/sheet stacked beneath the header.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MobileNavProvider>
      <div className="flex min-h-dvh flex-col bg-background">
        <Topbar />
        <div className="isolate flex flex-1">
          <AppNav />
          <main id="main" className="min-w-0 flex-1 bg-workspace">
            {children}
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
