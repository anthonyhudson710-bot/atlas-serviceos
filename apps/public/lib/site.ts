/**
 * Single source of truth for site-wide identity, navigation, and contact.
 * Consumed by metadata, JSON-LD, sitemap, robots, header, and footer so the
 * brand stays coherent everywhere. Canonical URL is env-overridable so the
 * same build runs in preview and production.
 */
export const siteConfig = {
  name: "Atlas",
  legalName: "Atlas FSM",
  // One-liner (≤155 chars) — also the default meta description.
  tagline: "Field service software for growing trade businesses.",
  description:
    "Atlas is the all-in-one field service platform for growing trade businesses — schedule, dispatch, estimate, invoice, and get paid, without the bloated price tag of legacy tools.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.atlasfsm.com",
  contactEmail: "hello@atlasfsm.com",
  // Social handles — placeholders until profiles exist (used in JSON-LD sameAs + footer).
  social: {
    x: "https://x.com/atlasfsm",
    linkedin: "https://www.linkedin.com/company/atlasfsm",
  },
  // Pre-launch nav is intentionally minimal. Hashes are home-absolute (/#…)
  // so they also work when clicked from another route (e.g. /pricing).
  nav: [
    { href: "/#what", label: "What we're building" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#why", label: "Why Atlas" },
    { href: "/#faq", label: "FAQ" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
