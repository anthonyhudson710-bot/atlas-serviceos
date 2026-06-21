import { MagnifyingGlass, Bell } from "@phosphor-icons/react/dist/ssr";
import { MobileMenuButton } from "@/components/app-shell/MobileMenuButton";
import { QuickAddMenu } from "@/components/app-shell/QuickAddMenu";
import { ProfileMenu } from "@/components/app-shell/ProfileMenu";

/**
 * Light workspace header that sits above scrolling content. Holds the mobile
 * nav burger (rail is off-canvas below lg), a (presentational) global search,
 * and quick actions. Sticky so it stays put as the workspace scrolls under it.
 */
export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <MobileMenuButton />

      <form role="search" className="flex-1 sm:max-w-md" action="#">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <MagnifyingGlass
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-2"
          />
          <input
            type="search"
            placeholder="Search jobs, customers, invoices…"
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted-2 focus-visible:border-ring focus-visible:bg-background"
          />
        </label>
      </form>

      <div className="ml-auto flex items-center gap-1.5">
        <QuickAddMenu />

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
        >
          <Bell size={20} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 size-2 rounded-full bg-signal ring-2 ring-background"
          />
        </button>

        {/* Profile lives in the desktop rail; surface it in the header on mobile. */}
        <div className="lg:hidden">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
