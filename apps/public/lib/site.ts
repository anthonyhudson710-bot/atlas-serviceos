/**
 * Single source of truth for site-wide constants used across metadata,
 * Open Graph tags, sitemaps, etc. The canonical URL is overridable per
 * environment via NEXT_PUBLIC_SITE_URL so the same build works in
 * preview and production.
 */
export const siteConfig = {
  name: "Atlas",
  description: "Atlas — field service management, reimagined.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.atlasfsm.com",
} as const;

export type SiteConfig = typeof siteConfig;
