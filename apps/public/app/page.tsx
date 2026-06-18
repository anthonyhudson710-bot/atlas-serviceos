import {
  CalendarCheck,
  Receipt,
  DeviceMobile,
  Tag,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { hero, pillars, why, howItWorks, faqs, finalCta } from "@/lib/content";

const TRADES = ["HVAC", "Plumbing", "Electrical", "Landscaping", "Cleaning"];

function PillarIcon({ name }: { name: string }) {
  const cls = "size-6 text-brand";
  switch (name) {
    case "CalendarCheck":
      return <CalendarCheck weight="bold" className={cls} aria-hidden="true" />;
    case "Receipt":
      return <Receipt weight="bold" className={cls} aria-hidden="true" />;
    case "DeviceMobile":
      return <DeviceMobile weight="bold" className={cls} aria-hidden="true" />;
    case "Tag":
      return <Tag weight="bold" className={cls} aria-hidden="true" />;
    default:
      return null;
  }
}

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema()} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative brand wash — aria-hidden, pointer-events-none. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-surface to-background"
        />
        <Container className="pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
              {hero.eyebrow}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
              {hero.subtitle}
            </p>

            <div className="mx-auto mt-10 max-w-xl">
              <WaitlistForm id="waitlist" />
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted">
              <li className="font-medium text-foreground">Built for:</li>
              {TRADES.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-muted" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── What we're building ──────────────────────────────────────────── */}
      <Section id="what" surface labelledby="what-heading">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="what-heading"
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              One platform, from the first call to getting paid.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Everything a growing trade business runs on — without juggling five
              apps and a spreadsheet.
            </p>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <li
                key={p.title}
                className="rounded-2xl border border-border bg-background p-6 shadow-card"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-surface-2">
                  <PillarIcon name={p.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Why Atlas ────────────────────────────────────────────────────── */}
      <Section id="why" labelledby="why-heading">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2
                id="why-heading"
                className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                {why.title}
              </h2>
              {why.body.map((para) => (
                <p key={para.slice(0, 24)} className="mt-5 text-lg leading-8 text-muted">
                  {para}
                </p>
              ))}
              <p className="mt-6 font-medium text-foreground">{why.signature}</p>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-8 shadow-card">
              <p className="text-xl font-medium leading-9 text-foreground text-balance">
                “The right tool should pay for itself in the first week — not take a
                week just to set up.”
              </p>
              <p className="mt-6 text-sm text-muted">
                Our north star: a platform an owner-operator can adopt on a Sunday
                and run their whole week on by Monday.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── How early access works ───────────────────────────────────────── */}
      <Section surface labelledby="how-heading">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="how-heading"
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {howItWorks.title}
            </h2>
          </div>
          <ol className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {howItWorks.steps.map((s) => (
              <li key={s.step}>
                <span className="font-mono text-sm font-semibold text-brand-strong">
                  {s.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── FAQ (native <details> — accessible, zero JS) ─────────────────── */}
      <Section id="faq" labelledby="faq-heading">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2
              id="faq-heading"
              className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Questions, answered.
            </h2>
            <div className="mt-12 divide-y divide-border border-y border-border">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus
                      size={20}
                      className="shrink-0 text-muted transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-base leading-7 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <Section surface labelledby="cta-heading">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-background p-10 text-center shadow-card sm:p-14">
            <h2
              id="cta-heading"
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted">{finalCta.subtitle}</p>
            <div className="mx-auto mt-8 max-w-xl">
              <WaitlistForm id="waitlist-bottom" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
