"use client";

import { Fragment, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  CalendarCheck,
  Wrench,
  AddressBook,
  Receipt,
  Gear,
  CaretLineLeft,
  CaretLineRight,
  type Icon,
} from "@phosphor-icons/react";
import { useMobileNav } from "@/components/app-shell/nav-context";
import { sections, type NavSection } from "@/lib/app";

// All rail icons share one component type; key them by the string in lib/app.ts.
const ICONS: Record<string, Icon> = {
  SquaresFour,
  CalendarCheck,
  Wrench,
  AddressBook,
  Receipt,
  Gear,
};

const COLLAPSE_KEY = "harmony_nav_collapsed";

// The desktop collapse preference lives in localStorage and is read during
// render via useSyncExternalStore — SSR-safe (server snapshot is "expanded")
// and synced across tabs, with no setState-in-effect.
const collapseListeners = new Set<() => void>();
function subscribeCollapse(cb: () => void) {
  collapseListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    collapseListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function getCollapsedSnapshot() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}
function setCollapsedPref(value: boolean) {
  try {
    localStorage.setItem(COLLAPSE_KEY, value ? "1" : "0");
  } catch {
    // ignore persistence failures (private mode)
  }
  collapseListeners.forEach((l) => l());
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Light, single-level left sidebar. Each section in `lib/app.ts` is one row
 * (icon + label); its first item is the section's primary route. Sections whose
 * pages don't exist yet render as muted "Soon" rows. Collapses to an icon rail
 * on desktop (preference persisted); off-canvas behind the header burger below
 * `lg`, where the burger's open state is shared via `useMobileNav`.
 */
export function AppNav() {
  const pathname = usePathname();
  const { open: drawerOpen, setOpen: setDrawerOpen } = useMobileNav();
  const collapsed = useSyncExternalStore(subscribeCollapse, getCollapsedSnapshot, () => false);
  const navRef = useRef<HTMLElement>(null);

  const toggleCollapsed = () => setCollapsedPref(!collapsed);
  const closeDrawer = () => setDrawerOpen(false);

  // While the mobile drawer is open, dismiss on Escape or an outside click.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [drawerOpen, setDrawerOpen]);

  // The section whose sheet contains the current route drives the highlight.
  const activeKey =
    sections.find((s) => s.items.some((i) => isActive(pathname, i.href)))?.key ?? null;

  return (
    <>
      {/* Mobile-only backdrop behind the slid-in sidebar (below the header). */}
      {drawerOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-14 z-[1090] bg-[rgb(13_15_21/0.45)] lg:hidden"
          aria-hidden="true"
          onClick={closeDrawer}
        />
      )}

      <nav
        ref={navRef}
        aria-label="Primary"
        className={`ac-nav ac-scroll fixed bottom-0 left-0 top-14 z-[1095] transition-transform lg:static lg:top-0 lg:z-auto lg:translate-x-0 ${
          collapsed ? "is-collapsed" : ""
        } ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="ac-nav-head">
          <span className="ac-nav-label ac-nav-head-t">Navigation</span>
          <button
            type="button"
            onClick={toggleCollapsed}
            className="ac-nav-toggle hidden lg:inline-flex"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <CaretLineRight size={17} /> : <CaretLineLeft size={17} />}
          </button>
        </div>

        {sections.map((s) => (
          <Fragment key={s.key}>
            {s.key === "settings" && <div className="ac-nav-rule" aria-hidden="true" />}
            <NavRow section={s} active={activeKey === s.key} onNavigate={closeDrawer} />
          </Fragment>
        ))}
      </nav>
    </>
  );
}

function NavRow({
  section,
  active,
  onNavigate,
}: {
  section: NavSection;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = ICONS[section.icon] ?? SquaresFour;
  const primary = section.items[0];
  const live = primary && !primary.disabled;

  if (!live) {
    return (
      <span className="ac-nav-item" aria-disabled="true" title={section.label}>
        <Icon size={18} weight="regular" aria-hidden="true" />
        <span className="ac-nav-label min-w-0 flex-1 truncate">{section.label}</span>
        <span className="ac-nav-badge">Soon</span>
      </span>
    );
  }

  return (
    <Link
      href={primary.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={section.label}
      className={`ac-nav-item ${active ? "on" : ""}`}
    >
      <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
      <span className="ac-nav-label min-w-0 flex-1 truncate">{section.label}</span>
    </Link>
  );
}
