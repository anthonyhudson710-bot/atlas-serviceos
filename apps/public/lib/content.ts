/**
 * Marketing copy for the Phase 1 early-access site, kept out of the components
 * so it reads as one editable document and feeds both the page and the
 * FAQ JSON-LD. Copy is deliberately vision-framed ("what we're building") and
 * honest — Atlas is pre-launch, so nothing here claims a shipped feature.
 *
 * Positioning (broad multi-trade SMB wedge — refine with real strategy):
 *   Atlas is the field service platform for growing trade businesses (1–15
 *   techs, owner-operator buyer) who want to schedule, dispatch, invoice and
 *   get paid — without the bloated price or steep setup of legacy tools.
 */

export const hero = {
  eyebrow: "Now onboarding early access",
  // Split so the payoff phrase can be color-highlighted (evermore §5.4).
  title: "Field service software that respects your time — and ",
  titleHighlight: "your margins.",
  subtitle:
    "Atlas brings scheduling, dispatch, estimates, invoicing, and payments into one place built for growing trade businesses — without the enterprise price tag or the week-long setup.",
  formMicrocopy: "Join the early-access list. No spam — just an invite when your spot opens.",
} as const;

/** What we're building — outcome-led, not feature-led. */
export const pillars = [
  {
    icon: "CalendarCheck",
    title: "Schedule & dispatch in seconds",
    body: "Drag-and-drop scheduling and real-time dispatch your whole crew can see from the road — no more whiteboards or group texts.",
  },
  {
    icon: "Receipt",
    title: "Estimate → invoice → paid",
    body: "Turn a quote into an invoice into money in the bank without re-typing a thing. Get paid faster with card and bank payments built in.",
  },
  {
    icon: "DeviceMobile",
    title: "Built for the field",
    body: "A fast mobile app designed to keep working when the signal doesn't, so your techs stay productive even off-grid.",
  },
  {
    icon: "Tag",
    title: "Honest, transparent pricing",
    body: "Clear plans you can read right on the website. No “contact sales to find out what it costs,” no surprise per-seat math.",
  },
] as const;

/** Why Atlas — the problem + the wedge. */
export const why = {
  title: "The trades deserve better tools.",
  body: [
    "The software running field service businesses is either too expensive, too complicated, or both. The powerful platforms are priced for 50-truck operations and take weeks to set up. The cheap ones nickel-and-dime you and fall over in the field.",
    "We're building Atlas for the owner-operators and growing shops in between — the HVAC, plumbing, electrical, landscaping, and cleaning businesses the incumbents priced out or overcomplicated. Modern, fast, fairly priced, and genuinely useful from day one.",
  ],
  signature: "— The team building Atlas",
} as const;

/** How early access works. */
export const howItWorks = {
  title: "How early access works",
  steps: [
    {
      step: "01",
      title: "Join the list",
      body: "Drop your email below. It takes ten seconds and there's no commitment.",
    },
    {
      step: "02",
      title: "We invite you in waves",
      body: "We're onboarding businesses in small batches so we can give each one real attention. You'll get an invite as spots open.",
    },
    {
      step: "03",
      title: "Help shape it",
      body: "Early-access members get a direct line to the team and founding-customer pricing for life.",
    },
  ],
} as const;

/** FAQ — also emitted as FAQPage JSON-LD for SEO/GEO citation. */
export const faqs = [
  {
    q: "When does Atlas launch?",
    a: "Atlas is in active development and we're onboarding early-access businesses in waves right now. Join the list and we'll invite you as spots open.",
  },
  {
    q: "What will it cost?",
    a: "Transparent, published pricing — no hidden “call us” tiers. Early-access members lock in founding-customer pricing.",
  },
  {
    q: "Which trades is Atlas for?",
    a: "Multi-trade home and field service businesses — HVAC, plumbing, electrical, landscaping, cleaning, and more — from solo operators to roughly 15-tech shops.",
  },
  {
    q: "Will it work on my phone in the field?",
    a: "Yes. A fast mobile experience that keeps working even with spotty signal is core to what we're building.",
  },
  {
    q: "Is my email safe?",
    a: "We only use it to send early-access updates — no spam and we never sell your data. See our Privacy Policy for details.",
  },
] as const;

export const finalCta = {
  title: "Be first in line.",
  subtitle:
    "Early-access spots are limited and going out in waves. Add your email and we'll save you a place.",
} as const;

/**
 * Pricing — transparent tiers are a core differentiator (§1). Atlas is
 * pre-launch, so these are indicative FOUNDING prices being finalized during
 * early access; the on-page banner says so. Edit numbers/features here.
 */
export const pricing = {
  eyebrow: "Pricing",
  title: "Simple, transparent pricing. ",
  titleHighlight: "No surprises.",
  subtitle:
    "Plans you can read right here — no “contact sales to find out what it costs.” Early-access members lock in founding rates for life.",
  note: "These are indicative founding prices while Atlas is in early access. Final plans are confirmed at launch — join the list to lock in founding rates.",
  tiers: [
    {
      name: "Starter",
      price: "$29",
      period: "/mo",
      blurb: "For solo operators getting organized.",
      featured: false,
      features: [
        "Scheduling & dispatch",
        "Estimates & invoicing",
        "Mobile app for the field",
        "Up to 2 users",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$79",
      period: "/mo",
      blurb: "For growing teams that live in the field.",
      featured: true,
      features: [
        "Everything in Starter",
        "Card & bank payments",
        "Customer CRM & history",
        "Up to 10 users",
        "Priority support",
      ],
    },
    {
      name: "Business",
      price: "$149",
      period: "/mo",
      blurb: "For established shops scaling up.",
      featured: false,
      features: [
        "Everything in Pro",
        "Advanced reporting",
        "Custom workflows",
        "Unlimited users",
        "Dedicated onboarding",
      ],
    },
  ],
} as const;
