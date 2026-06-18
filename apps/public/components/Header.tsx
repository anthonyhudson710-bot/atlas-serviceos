import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

/**
 * Sticky, translucent header. Pre-launch nav is intentionally minimal and the
 * anchor links collapse on mobile — the early-access CTA is always visible.
 * Pure server component: ships no JavaScript.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="rounded-lg" aria-label={`${siteConfig.name} home`}>
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ButtonLink href="#waitlist">Get early access</ButtonLink>
      </Container>
    </header>
  );
}
