import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  CreditCard,
  AddressBook,
  DeviceMobile,
  Lightning,
  ChatCircleText,
  Wrench,
  Receipt,
  CheckCircle,
  Trophy,
  ClockCounterClockwise,
  Money,
  Snowflake,
  Drop,
  Plant,
  Leaf,
  Broom,
  Bug,
  Hammer,
  HouseLine,
  PaintRoller,
  Plus,
  Check,
  X,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { WaitlistForm } from "@/components/WaitlistForm";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import {
  hero,
  heroCta,
  platform,
  workflow,
  comparison,
  outcomes,
  industries,
  why,
  howItWorks,
  faqs,
  finalCta,
} from "@/lib/content";

// ── Icon registry (all Phosphor icons share one component type) ──────────────
const ICONS: Record<string, typeof CalendarCheck> = {
  CalendarCheck,
  FileText,
  CreditCard,
  AddressBook,
  DeviceMobile,
  Lightning,
  ChatCircleText,
  Wrench,
  Receipt,
  CheckCircle,
  Trophy,
  ClockCounterClockwise,
  Money,
  Snowflake,
  Drop,
  Plant,
  Leaf,
  Broom,
  Bug,
  Hammer,
  HouseLine,
  PaintRoller,
};

function Glyph({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name];
  return Cmp ? <Cmp weight="bold" className={className} aria-hidden="true" /> : null;
}

const TONE: Record<string, string> = {
  signal: "bg-signal",
  teal: "bg-teal",
  verdant: "bg-verdant",
  royal: "bg-royal",
};

// A stylized product preview (no screenshot needed) — a mini dispatch board.
function HeroPreview() {
  const jobs = [
    { t: "8:00", c: "AC tune-up — Ramirez", who: "Mike", tone: "signal" },
    { t: "10:30", c: "Drain cleaning — 4th St.", who: "Dana", tone: "teal" },
    { t: "1:00", c: "Panel upgrade — Okafor", who: "Sam", tone: "verdant" },
    { t: "3:30", c: "Quote — Hillcrest reno", who: "You", tone: "royal" },
  ];
  return (
    <div className="mx-auto w-full max-w-md" aria-hidden="true">
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-card">
        <div className="h-1.5 bg-spectrum" />
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-sm font-bold text-foreground">Today&rsquo;s schedule</span>
          <span className="text-xs text-muted-2">Tue · 6 jobs</span>
        </div>
        <ul className="divide-y divide-border">
          {jobs.map((j) => (
            <li key={j.t} className="flex items-center gap-3 px-5 py-3">
              <span className="w-11 shrink-0 text-xs font-semibold text-muted-2">{j.t}</span>
              <span className={`size-2 shrink-0 rounded-full ${TONE[j.tone]}`} />
              <span className="flex-1 truncate text-sm text-foreground">{j.c}</span>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">{j.who}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-3">
          <span className="text-xs text-muted-2">Invoice #1042 · $480</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
            Paid <CheckCircle weight="fill" size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema()} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-surface to-background"
        />
        <Container className="pt-10 pb-16 sm:pt-12 sm:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <span className="text-spectrum text-sm font-extrabold uppercase tracking-wide">
                {hero.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {hero.title}
                <span className="text-brand">{hero.titleHighlight}</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted lg:mx-0">
                {hero.subtitle}
              </p>

              <div className="mx-auto mt-8 max-w-xl lg:mx-0">
                <WaitlistForm id="waitlist" />
              </div>

              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:justify-start">
                <p className="text-sm text-muted-2">{heroCta.reassure}</p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-royal"
                >
                  {heroCta.secondary} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-2 lg:mt-0">
              <HeroPreview />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Platform showcase ────────────────────────────────────────────── */}
      <Section id="what" surface labelledby="platform-heading">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-spectrum text-sm font-extrabold uppercase tracking-wide">
              {platform.eyebrow}
            </span>
            <h2
              id="platform-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {platform.title}
              <span className="text-brand">{platform.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-lg text-muted">{platform.subtitle}</p>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {platform.features.map((f) => (
              <li
                key={f.title}
                className="rounded-card border border-border bg-background p-6 shadow-card"
              >
                <span className="grid size-12 place-items-center rounded-card bg-surface-2">
                  <Glyph name={f.icon} className="size-6 text-signal" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Workflow stepper ─────────────────────────────────────────────── */}
      <Section labelledby="workflow-heading">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-spectrum text-sm font-extrabold uppercase tracking-wide">
              {workflow.eyebrow}
            </span>
            <h2
              id="workflow-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {workflow.title}
              <span className="text-brand">{workflow.titleHighlight}</span>
            </h2>
          </div>

          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workflow.steps.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-4 rounded-card border border-border bg-background p-5 shadow-card"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-card bg-surface-2">
                  <Glyph name={s.icon} className="size-5 text-signal" />
                </span>
                <div>
                  <p className="text-spectrum text-xs font-extrabold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-0.5 text-base font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── Why switch: comparison ───────────────────────────────────────── */}
      <Section surface labelledby="compare-heading">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-spectrum text-sm font-extrabold uppercase tracking-wide">
              {comparison.eyebrow}
            </span>
            <h2
              id="compare-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {comparison.title}
              <span className="text-brand">{comparison.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-lg text-muted">{comparison.subtitle}</p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-card border border-border bg-background shadow-card">
            <div className="grid grid-cols-[1fr_auto_auto] items-stretch">
              <div className="border-b border-border px-4 py-3 sm:px-6" />
              <div className="border-b border-l border-border bg-surface px-4 py-3 text-center text-sm font-bold text-foreground sm:px-6">
                {comparison.columns.atlas}
              </div>
              <div className="border-b border-l border-border px-4 py-3 text-center text-sm font-semibold text-muted-2 sm:px-6">
                {comparison.columns.legacy}
              </div>

              {comparison.rows.map((row) => (
                <div key={row.label} className="contents">
                  <div className="border-b border-border px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                    {row.label}
                  </div>
                  <div className="border-b border-l border-border bg-surface px-4 py-4 text-sm text-foreground sm:px-6">
                    <span className="flex gap-2">
                      <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-verdant" aria-hidden="true" />
                      {row.atlas}
                    </span>
                  </div>
                  <div className="border-b border-l border-border px-4 py-4 text-sm text-muted sm:px-6">
                    <span className="flex gap-2">
                      <X size={18} weight="bold" className="mt-0.5 shrink-0 text-muted-2" aria-hidden="true" />
                      {row.legacy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <ButtonLink href="#waitlist">Make the switch — get early access</ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ── Outcomes ─────────────────────────────────────────────────────── */}
      <Section labelledby="outcomes-heading">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="outcomes-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {outcomes.title}
              <span className="text-brand">{outcomes.titleHighlight}</span>
            </h2>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {outcomes.items.map((o) => (
              <li key={o.title} className="rounded-card border border-border bg-background p-7 text-center shadow-card">
                <span className="mx-auto grid size-14 place-items-center rounded-card bg-surface-2">
                  <Glyph name={o.icon} className="size-7 text-signal" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{o.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{o.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <Section surface labelledby="industries-heading">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-spectrum text-sm font-extrabold uppercase tracking-wide">
              {industries.eyebrow}
            </span>
            <h2
              id="industries-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {industries.title}
            </h2>
            <p className="mt-4 text-lg text-muted">{industries.subtitle}</p>
          </div>
          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {industries.items.map((t) => (
              <li
                key={t.name}
                className="flex flex-col items-center gap-3 rounded-card border border-border bg-background p-5 text-center shadow-card"
              >
                <Glyph name={t.icon} className="size-7 text-signal" />
                <span className="text-sm font-semibold text-foreground">{t.name}</span>
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
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                The trades deserve <span className="text-brand">better tools</span>.
              </h2>
              {why.body.map((para) => (
                <p key={para.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-muted">
                  {para}
                </p>
              ))}
              <p className="mt-6 font-semibold text-foreground">{why.signature}</p>
            </div>

            <div className="rounded-card border border-border bg-surface p-8 shadow-card">
              <p className="text-balance text-xl font-medium leading-relaxed text-foreground">
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
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {howItWorks.title}
            </h2>
          </div>
          <ol className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {howItWorks.steps.map((s) => (
              <li key={s.step}>
                <span className="text-spectrum text-base font-extrabold">{s.step}</span>
                <h3 className="mt-3 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section id="faq" labelledby="faq-heading">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2
              id="faq-heading"
              className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Questions, <span className="text-brand">answered</span>.
            </h2>
            <div className="mt-12 divide-y divide-border border-y border-border">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus
                      size={20}
                      className="shrink-0 text-muted-2 transition-transform group-open:rotate-45"
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
          <div className="mx-auto max-w-2xl overflow-hidden rounded-card border border-border bg-background text-center shadow-card">
            <div className="h-1.5 bg-spectrum" aria-hidden="true" />
            <div className="p-10 sm:p-14">
              <h2
                id="cta-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Be <span className="text-brand">first in line</span>.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-muted">{finalCta.subtitle}</p>
              <div className="mx-auto mt-8 max-w-xl">
                <WaitlistForm id="waitlist-bottom" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
