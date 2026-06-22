import Link from "next/link";
import { MagnifyingGlass, Bell, Question } from "@phosphor-icons/react/dist/ssr";
import { MobileMenuButton } from "@/components/app-shell/MobileMenuButton";
import { QuickAddMenu } from "@/components/app-shell/QuickAddMenu";
import { ProfileMenu } from "@/components/app-shell/ProfileMenu";
import { appConfig } from "@/lib/app";

/**
 * Global header: brand block + a (presentational) global search, quick-create,
 * notifications, help and the account menu. Full width, fixed height; the
 * workspace scrolls beneath it. Below `lg` it also holds the burger that toggles
 * the off-canvas sidebar.
 */
export function Topbar() {
  return (
    <header className="ac-topbar">
      <MobileMenuButton />

      {/* Brand */}
      <Link
        href="/"
        aria-label={`${appConfig.brand} ${appConfig.console} — home`}
        className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="grid size-8 place-items-center rounded-[9px] bg-spectrum shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10.5" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.6" />
            <path d="M12 3l3.4 9L12 21l-3.4-9L12 3z" fill="#fff" />
          </svg>
        </span>
        <span className="hidden flex-col gap-0.5 leading-none sm:flex">
          <span className="text-[15.5px] font-bold tracking-tight text-[var(--navy-800)]">
            {appConfig.brand} {appConfig.console}
          </span>
          <span className="ac-mono text-[9px] font-semibold uppercase tracking-[0.11em] text-[var(--color-text-tertiary)]">
            Admin Console
          </span>
        </span>
      </Link>

      {/* Search */}
      <form role="search" action="#" className="hidden min-w-0 flex-1 md:flex md:max-w-[440px]">
        <label className="relative flex w-full items-center">
          <span className="sr-only">Search</span>
          <MagnifyingGlass
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 text-[var(--color-text-tertiary)]"
          />
          <input
            type="search"
            placeholder="Search jobs, customers, invoices…"
            className="h-9 w-full rounded-[9px] border border-[var(--color-border-default)] bg-[var(--color-bg-surface-sunken)] pl-9 pr-14 text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:border-[var(--color-border-focus)] focus-visible:bg-[var(--color-bg-surface)]"
          />
          <kbd className="ac-mono pointer-events-none absolute right-2.5 rounded-[5px] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--color-text-secondary)]">
            ⌘K
          </kbd>
        </label>
      </form>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <QuickAddMenu />

        <button
          type="button"
          aria-label="Notifications"
          className="ac-btn b-ghost relative size-[34px] px-0"
        >
          <Bell size={18} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-[6px] top-[5px] size-[7px] rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-bg-surface)]"
          />
        </button>

        <button
          type="button"
          aria-label="Help"
          className="ac-btn b-ghost hidden size-[34px] px-0 sm:inline-flex"
        >
          <Question size={18} aria-hidden="true" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-[var(--color-border-default)] sm:block" />

        <ProfileMenu />
      </div>
    </header>
  );
}
