/**
 * Single source of truth for the Harmony console: brand identity and the
 * two-level navigation. The left side is a narrow icon rail (one icon per
 * `section`); clicking an icon opens a sheet of that section's `items`.
 * Mirrors the spirit of `apps/public`'s `lib/site.ts`.
 */
export const appConfig = {
  // Product brand shown in the UI. "Harmony" is the console's codename + the
  // subdomain it deploys to; the user-facing brand is Atlas.
  brand: "Atlas",
  console: "Harmony",
  tagline: "Field service operations, in one place.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://harmony.atlasfsm.com",
} as const;

/** A leaf link in a section sheet. `disabled` items render as muted "Soon" rows. */
export type NavLeaf = { href: string; label: string; disabled?: boolean };

/** A top-level rail entry: one icon, a flyout sheet of `items`. */
export type NavSection = {
  key: string;
  label: string;
  icon: string; // resolves against the icon registry in AppNav
  items: readonly NavLeaf[];
};

/**
 * Rail sections, top to bottom. Only the Dashboard → Overview leaf ("/") is
 * built in this scaffold; everything else is `disabled` so the nav reads as a
 * complete product without shipping empty routes. Drop `disabled` and add the
 * matching `app/<route>/page.tsx` to light a leaf up.
 */
export const sections: readonly NavSection[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "SquaresFour",
    items: [
      { href: "/", label: "Overview" },
      { href: "/activity", label: "Activity", disabled: true },
    ],
  },
  {
    key: "schedule",
    label: "Schedule",
    icon: "CalendarCheck",
    items: [
      { href: "/schedule", label: "Calendar", disabled: true },
      { href: "/schedule/dispatch", label: "Dispatch board", disabled: true },
      { href: "/schedule/map", label: "Map view", disabled: true },
    ],
  },
  {
    key: "jobs",
    label: "Jobs",
    icon: "Wrench",
    items: [
      { href: "/jobs", label: "All jobs", disabled: true },
      { href: "/jobs/estimates", label: "Estimates", disabled: true },
      { href: "/jobs/work-orders", label: "Work orders", disabled: true },
    ],
  },
  {
    key: "customers",
    label: "Customers",
    icon: "AddressBook",
    items: [
      { href: "/customers", label: "All customers", disabled: true },
      { href: "/customers/companies", label: "Companies", disabled: true },
      { href: "/customers/contacts", label: "Contacts", disabled: true },
    ],
  },
  {
    key: "invoices",
    label: "Invoices",
    icon: "Receipt",
    items: [
      { href: "/invoices", label: "All invoices", disabled: true },
      { href: "/invoices/payments", label: "Payments", disabled: true },
      { href: "/invoices/statements", label: "Statements", disabled: true },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: "Gear",
    items: [
      { href: "/settings", label: "Company profile", disabled: true },
      { href: "/settings/team", label: "Team", disabled: true },
      { href: "/settings/billing", label: "Billing", disabled: true },
      { href: "/settings/integrations", label: "Integrations", disabled: true },
    ],
  },
] as const;

/**
 * The account entry pinned to the bottom of the rail. Same sheet mechanism as a
 * section; static placeholder until auth lands.
 */
export const account = {
  key: "account",
  user: { name: "Avery Hale", org: "Northwind Mechanical", initials: "AH" },
  items: [
    { href: "/account", label: "Profile", disabled: true },
    { href: "/account/preferences", label: "Preferences", disabled: true },
    { href: "/logout", label: "Sign out", disabled: true },
  ],
} as const;

export type AppConfig = typeof appConfig;
