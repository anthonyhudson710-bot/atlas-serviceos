import Link from "next/link";
import { XLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

const linkCls =
  "text-sm text-muted transition-colors hover:text-foreground rounded";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-muted">{siteConfig.description}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={siteConfig.social.x}
                aria-label={`${siteConfig.name} on X`}
                className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
                rel="me noopener"
              >
                <XLogo size={18} aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                aria-label={`${siteConfig.name} on LinkedIn`}
                className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
                rel="me noopener"
              >
                <LinkedinLogo size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Product">
            <h2 className="text-sm font-semibold text-foreground">Product</h2>
            <ul className="mt-4 space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkCls}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#waitlist" className={linkCls}>
                  Get early access
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company &amp; legal">
            <h2 className="text-sm font-semibold text-foreground">Company</h2>
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

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>Atlas is in early access — features described are in active development.</p>
        </div>
      </Container>
    </footer>
  );
}
