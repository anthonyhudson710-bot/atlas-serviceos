"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  CalendarCheck,
  Wrench,
  AddressBook,
  Receipt,
  Gear,
  type Icon,
} from "@phosphor-icons/react";
import { Logo } from "@/components/Logo";
import { useMobileNav } from "@/components/app-shell/nav-context";
import { sections, account, type NavLeaf, type NavSection } from "@/lib/app";

// All rail icons share one component type; key them by the string in lib/app.ts.
const ICONS: Record<string, Icon> = {
  SquaresFour,
  CalendarCheck,
  Wrench,
  AddressBook,
  Receipt,
  Gear,
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Two-level primary nav: a narrow Midnight icon rail, and a flyout sheet that
 * opens to the right of the rail with the clicked section's sub-items. One open
 * section at a time; Escape, an outside click, or navigating closes it.
 *
 * Below lg the rail is off-canvas (hidden by default) and slides in over a
 * backdrop when the Topbar burger is tapped — `useMobileNav` shares that state.
 * Whole thing is one client component so rail, sheet, and drawer share state.
 */
export function AppNav() {
  const pathname = usePathname();
  const { open: drawerOpen, setOpen: setDrawerOpen } = useMobileNav();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // The rail section whose sheet contains the current route (drives highlight).
  const activeKey =
    sections.find((s) => s.items.some((i) => isActive(pathname, i.href)))?.key ?? null;

  // Dismiss everything (used by navigations, the backdrop, and Escape).
  const closeAll = () => {
    setOpenKey(null);
    setDrawerOpen(false);
  };

  // While the sheet or the mobile drawer is open, dismiss on Escape or an
  // outside click. (Navigations originate inside the nav and close via handlers.)
  useEffect(() => {
    if (!openKey && !drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenKey(null);
        setDrawerOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openKey, drawerOpen, setDrawerOpen]);

  const toggle = (key: string) => setOpenKey((prev) => (prev === key ? null : key));

  const openSection = sections.find((s) => s.key === openKey) ?? null;
  const accountOpen = openKey === account.key;

  return (
    <div ref={navRef} className="relative z-40 shrink-0">
      {/* Mobile-only backdrop behind the slid-in rail + sheet (below the header). */}
      {drawerOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-ink/40 lg:hidden"
          aria-hidden="true"
          onClick={closeAll}
        />
      )}

      {/* Rail sits below the full-width Topbar (h-16): offset top + sticky on desktop. */}
      <nav
        aria-label="Primary"
        className={`fixed left-0 top-16 z-50 flex h-[calc(100dvh_-_4rem)] w-16 flex-col items-center gap-1 border-r border-sidebar-border bg-sidebar py-3 transition-[transform,translate] duration-200 ease-out lg:sticky lg:translate-x-0 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/"
          aria-label="Atlas Harmony — home"
          onClick={closeAll}
          className="mb-2 grid size-11 place-items-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Logo tone="dark" wordmark={false} />
        </Link>

        <div className="flex flex-1 flex-col items-center gap-1">
          {sections.map((s) => (
            <RailButton
              key={s.key}
              section={s}
              open={openKey === s.key}
              active={activeKey === s.key}
              onClick={() => toggle(s.key)}
            />
          ))}
        </div>

        <RailAvatar open={accountOpen} onClick={() => toggle(account.key)} />
      </nav>

      {(openSection || accountOpen) && (
        <Sheet
          title={openSection ? openSection.label : account.user.org}
          subtitle={accountOpen ? account.user.name : undefined}
          items={openSection ? openSection.items : account.items}
          onNavigate={closeAll}
        />
      )}
    </div>
  );
}

function RailButton({
  section,
  open,
  active,
  onClick,
}: {
  section: NavSection;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = ICONS[section.icon] ?? SquaresFour;
  const lit = open || active;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={section.label}
      aria-expanded={open}
      aria-current={active ? "page" : undefined}
      className={`group relative grid size-11 place-items-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
        lit ? "bg-sidebar-active text-white" : "text-sidebar-muted hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={22} weight={lit ? "fill" : "regular"} aria-hidden="true" />
      <Tooltip>{section.label}</Tooltip>
    </button>
  );
}

function RailAvatar({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Account"
      aria-expanded={open}
      className={`group relative mt-1 grid size-11 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
        open ? "ring-2 ring-white/70" : "ring-1 ring-white/10 hover:ring-white/40"
      }`}
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-full bg-spectrum text-xs font-bold text-white"
      >
        {account.user.initials}
      </span>
      <Tooltip>{account.user.name}</Tooltip>
    </button>
  );
}

/** Hover/focus label for an icon-only rail control. */
function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white opacity-0 shadow-overlay transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}

/** The flyout panel anchored to the right edge of the rail. */
function Sheet({
  title,
  subtitle,
  items,
  onNavigate,
}: {
  title: string;
  subtitle?: string;
  items: readonly NavLeaf[];
  onNavigate: () => void;
}) {
  return (
    <aside
      aria-label={`${title} navigation`}
      className="fixed bottom-0 left-16 top-16 z-50 flex w-60 flex-col border-l border-sidebar-border bg-sidebar text-sidebar-foreground shadow-overlay"
    >
      <div className="flex h-16 flex-col justify-center px-5">
        <p className="text-sm font-bold text-white">{title}</p>
        {subtitle && <p className="text-xs text-sidebar-muted">{subtitle}</p>}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="flex flex-col gap-0.5">
          {items.map((leaf) => (
            <li key={leaf.href}>
              <SheetLink leaf={leaf} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SheetLink({ leaf, onNavigate }: { leaf: NavLeaf; onNavigate: () => void }) {
  const pathname = usePathname();
  const base = "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors";

  if (leaf.disabled) {
    return (
      <span aria-disabled="true" className={`${base} cursor-default font-medium text-sidebar-muted/60`}>
        {leaf.label}
        <span className="rounded-full border border-sidebar-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sidebar-muted/70">
          Soon
        </span>
      </span>
    );
  }

  const active = isActive(pathname, leaf.href);
  return (
    <Link
      href={leaf.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={`${base} font-semibold ${
        active ? "bg-sidebar-active text-white" : "text-sidebar-muted hover:bg-white/5 hover:text-white"
      }`}
    >
      {leaf.label}
    </Link>
  );
}
