import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { AppShell } from "@/components/app-shell/AppShell";
import { appConfig } from "@/lib/app";
import "./globals.css";

// evermore's single typeface, variable weight axis. ss01 + tracking are set
// globally in globals.css.
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

const wordmark = `${appConfig.brand} ${appConfig.console}`;

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
  title: { default: wordmark, template: `%s · ${appConfig.brand}` },
  description: appConfig.tagline,
  applicationName: wordmark,
  // Private console — keep it out of search indexes.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  // White — matches the light global header at the top of the viewport.
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
