import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, softwareSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// evermore's single typeface, variable weight axis. ss01 + tracking are set
// globally in globals.css.
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

const titleDefault = `${siteConfig.name} — ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: titleDefault, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "field service management",
    "FSM software",
    "HVAC software",
    "plumbing software",
    "electrician software",
    "scheduling and dispatch",
    "invoicing for contractors",
    "trade business software",
  ],
  authors: [{ name: siteConfig.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: titleDefault,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Light only — the marketing site does not support dark mode.
  themeColor: "#ffffff",
};

// Privacy-first, cookieless analytics — only loads when the domain env is set,
// so no consent banner is required (scope §10).
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <JsonLd data={organizationSchema()} />
        <JsonLd data={softwareSchema()} />

        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />

        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
