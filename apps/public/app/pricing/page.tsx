import type { Metadata } from "next";
import { Check, Info } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { WaitlistForm } from "@/components/WaitlistForm";
import { pricing, finalCta } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Simple, transparent pricing for ${siteConfig.name} — no hidden tiers. Early-access members lock in founding rates.`,
  alternates: { canonical: "/pricing" },
};

export default function Pricing() {
  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px] bg-gradient-to-b from-surface to-background"
        />
        <Container className="pt-20 pb-12 text-center sm:pt-24">
          <span className="text-spectrum text-sm font-extrabold uppercase tracking-wide">
            {pricing.eyebrow}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {pricing.title}
            <span className="text-brand">{pricing.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {pricing.subtitle}
          </p>

          <p className="mx-auto mt-6 flex max-w-2xl items-start gap-2 rounded-card border border-border bg-surface-2 p-3 text-left text-sm text-muted">
            <Info size={18} weight="fill" className="mt-0.5 shrink-0 text-steel" aria-hidden="true" />
            <span>{pricing.note}</span>
          </p>
        </Container>
      </section>

      {/* ── Tiers ────────────────────────────────────────────────────────── */}
      <Container className="pb-8">
        <ul className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <li
              key={tier.name}
              className={`relative flex flex-col overflow-hidden rounded-card border bg-background shadow-card ${
                tier.featured ? "border-signal" : "border-border"
              }`}
            >
              {tier.featured && (
                <>
                  <div className="h-1.5 bg-spectrum" aria-hidden="true" />
                  <span className="absolute right-4 top-4 rounded-full bg-action px-3 py-1 text-xs font-bold text-white">
                    Most popular
                  </span>
                </>
              )}
              <div className="flex flex-1 flex-col p-8">
                <h2 className="text-lg font-bold text-foreground">{tier.name}</h2>
                <p className="mt-1 text-sm text-muted">{tier.blurb}</p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted">{tier.period}</span>
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted">
                      <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-verdant" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="#waitlist"
                  variant={tier.featured ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  Get early access
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {/* ── Waitlist CTA ─────────────────────────────────────────────────── */}
      <Section surface labelledby="cta-heading">
        <Container>
          <div className="mx-auto max-w-2xl overflow-hidden rounded-card border border-border bg-background text-center shadow-card">
            <div className="h-1.5 bg-spectrum" aria-hidden="true" />
            <div className="p-10 sm:p-14">
              <h2
                id="cta-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Lock in <span className="text-brand">founding pricing</span>.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-muted">{finalCta.subtitle}</p>
              <div className="mx-auto mt-8 max-w-xl">
                <WaitlistForm id="waitlist" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
