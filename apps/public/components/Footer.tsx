import Link from "next/link";
import { XLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

const linkCls = "text-sm text-white/75 transition-colors hover:text-white rounded";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      {/* Organic curve divider into the Midnight footer (evermore §9.6). */}
      <div aria-hidden="true" className="bg-surface">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block h-10 w-full sm:h-14"
        >
          <path d="M0 80 C 480 24 960 24 1440 80 Z" fill="#0b2370" />
        </svg>
      </div>

      <div className="bg-midnight text-white">
        <Container className="py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div className="max-w-xs">
              <Logo tone="dark" />
              <p className="mt-4 text-sm text-white/70">{siteConfig.description}</p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={siteConfig.social.x}
                  aria-label={`${siteConfig.name} on X`}
                  className="grid size-9 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white"
                  rel="me noopener"
                >
                  <XLogo size={18} aria-hidden="true" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  aria-label={`${siteConfig.name} on LinkedIn`}
                  className="grid size-9 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white"
                  rel="me noopener"
                >
                  <LinkedinLogo size={18} aria-hidden="true" />
                </a>
              </div>
            </div>

            <nav aria-label="Product">
              <h2 className="text-sm font-semibold text-white">Product</h2>
              <ul className="mt-4 space-y-3">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkCls}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/#waitlist" className={linkCls}>
                    Get early access
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Company and legal">
              <h2 className="text-sm font-semibold text-white">Company</h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={`mailto:${siteConfig.contactEmail}`} className={linkCls}>
                    Contact
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className={linkCls}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={linkCls}>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {siteConfig.legalName}. All rights reserved.
            </p>
            <p>Atlas is in early access — features described are in active development.</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
