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
 * Pricing — a growth ladder where every upgrade is triggered by a win, not a
 * wall (Free→Starter = "I got paying clients"; Starter→Crew = "I hired
 * someone"; Crew→Fleet = "I'm running multiple trucks"). Transparent pricing is
 * a core differentiator (§1). Atlas is pre-launch, so these are indicative
 * FOUNDING prices being finalized during early access; the banner says so.
 * Edit names/prices/features/caps here.
 */
export const pricing = {
  eyebrow: "Pricing",
  title: "Pricing that grows when you do. ",
  titleHighlight: "No surprises.",
  subtitle:
    "Start free, upgrade only when your business hits the next milestone — never because we nagged you. Plans you can read right here, no “contact sales to find out what it costs.”",
  tiers: [
    {
      name: "Solo",
      price: "Free",
      period: "",
      blurb: "Enough to run a side gig.",
      featured: false,
      cta: "Get early access",
      ctaHref: "#waitlist",
      features: [
        "1 user",
        "Scheduling & basic CRM",
        "Manual invoicing",
        "Up to 20 active clients",
        "“Powered by Atlas” on documents",
      ],
    },
    {
      name: "Starter",
      price: "$29",
      period: "/mo",
      blurb: "I'm a real business now.",
      featured: false,
      cta: "Get early access",
      ctaHref: "#waitlist",
      features: [
        "Everything in Solo, plus:",
        "Unlimited clients & jobs",
        "Integrated payments",
        "Online booking",
        "Automated reminders",
        "No Atlas branding",
      ],
    },
    {
      name: "Crew",
      price: "$79",
      period: "/mo",
      blurb: "You hired someone.",
      featured: true,
      cta: "Get early access",
      ctaHref: "#waitlist",
      features: [
        "Everything in Starter, plus:",
        "Unlimited office seats + up to ~10 field",
        "QuickBooks sync",
        "Dispatch board",
        "Full automations",
        "Time tracking",
      ],
    },
    {
      name: "Fleet",
      price: "$149",
      period: "/mo",
      blurb: "You're running multiple trucks.",
      featured: false,
      cta: "Get early access",
      ctaHref: "#waitlist",
      features: [
        "Everything in Crew, plus:",
        "Route optimization",
        "Advanced reporting",
        "Role-based permissions",
        "API access",
      ],
    },
  ],
} as const;

/* ───────────────────────── Homepage marketing sections ─────────────────────
   Original, conversion-focused copy for the full home page. Honest about
   pre-launch status — no fabricated usage counts or named testimonials. The
   "switch" comparison contrasts Atlas with legacy field-service tools as a
   category (not any single competitor by name). */

/** Hero CTA labels + supporting trust line. */
export const heroCta = {
  primary: "Get early access",
  secondary: "See pricing",
  reassure: "Free plan forever · Founding pricing for early members · No credit card",
} as const;

/** The platform at a glance — one place for the whole job lifecycle. */
export const platform = {
  eyebrow: "One platform",
  title: "Everything your service business runs on, ",
  titleHighlight: "in one place.",
  subtitle:
    "Stop stitching together a calendar app, a spreadsheet, a payment link, and three group chats. Atlas connects the whole job — from first call to final payment.",
  features: [
    {
      icon: "CalendarCheck",
      title: "Scheduling & dispatch",
      body: "A drag-and-drop calendar and live dispatch board your whole crew sees in real time. Assign work, balance routes, and fill gaps in seconds.",
    },
    {
      icon: "FileText",
      title: "Quotes & estimates",
      body: "Send polished, branded quotes from the driveway. Clients approve online, and approved work flows straight onto the schedule.",
    },
    {
      icon: "CreditCard",
      title: "Invoicing & payments",
      body: "Turn finished jobs into invoices in a tap and collect by card, bank, or in person. Automatic follow-ups chase down what you're owed.",
    },
    {
      icon: "AddressBook",
      title: "Client CRM",
      body: "Every client's full history — quotes, jobs, photos, notes, and messages — in one tidy record your whole team can pull up on site.",
    },
    {
      icon: "DeviceMobile",
      title: "Mobile, built for the field",
      body: "A fast app designed to keep working when the signal doesn't. Your techs stay productive in the basement, the boonies, and the dead zones.",
    },
    {
      icon: "Lightning",
      title: "Automations",
      body: "Appointment reminders, on-my-way texts, review requests, and follow-ups run themselves — so fewer no-shows and more five-star reviews.",
    },
  ],
} as const;

/** From first call to final payment — the lifecycle stepper. */
export const workflow = {
  eyebrow: "How the work flows",
  title: "From first call to ",
  titleHighlight: "money in the bank.",
  steps: [
    { icon: "ChatCircleText", title: "Request comes in", body: "Online booking and a request form capture new work day or night." },
    { icon: "FileText", title: "Quote it", body: "Build and send a branded quote in minutes; clients approve in a click." },
    { icon: "CalendarCheck", title: "Schedule & dispatch", body: "Drop the job on the calendar and route the right tech to it." },
    { icon: "Wrench", title: "Do the work", body: "Crews get details, checklists, and directions on the mobile app." },
    { icon: "Receipt", title: "Invoice", body: "Convert the completed job into an invoice without re-typing a thing." },
    { icon: "CheckCircle", title: "Get paid", body: "Collect by card or bank; automated reminders handle the stragglers." },
  ],
} as const;

/** Why teams switch — Atlas vs legacy field-service tools. */
export const comparison = {
  eyebrow: "Why teams switch",
  title: "Made to move you off ",
  titleHighlight: "clunky, overpriced tools.",
  subtitle:
    "If your current software feels like it was built for a 50-truck enterprise and priced like it too, you're our people.",
  columns: { atlas: "Atlas", legacy: "Legacy tools" },
  rows: [
    { label: "Pricing", atlas: "Transparent and published — founding rates locked in", legacy: "“Contact sales” black boxes and surprise renewals" },
    { label: "Seats", atlas: "Fair — unlimited office seats on team plans", legacy: "Charged per user until it hurts" },
    { label: "Setup", atlas: "Up and running in an afternoon", legacy: "Weeks of onboarding calls" },
    { label: "In the field", atlas: "Offline-first, built for spotty signal", legacy: "Freezes the moment you lose a bar" },
    { label: "Experience", atlas: "Fast, modern, genuinely pleasant to use", legacy: "Dated, cluttered, slow" },
    { label: "Switching", atlas: "Free, guided migration of your clients & history", legacy: "Export a CSV and good luck" },
  ],
} as const;

/** Outcome band — what the platform is designed to do (no fabricated stats). */
export const outcomes = {
  title: "Built to help you ",
  titleHighlight: "win, work, and earn more.",
  items: [
    { icon: "Trophy", title: "Win more work", body: "Fast quotes, online booking, and automatic follow-up so fewer leads slip away." },
    { icon: "ClockCounterClockwise", title: "Save hours every week", body: "Scheduling, invoicing, and reminders that run on autopilot instead of on your evenings." },
    { icon: "Money", title: "Get paid faster", body: "One-tap invoices, card and bank payments, and reminders that collect what you're owed." },
  ],
} as const;

/** Trades Atlas is built for (who it's FOR — honest, not a customer list). */
export const industries = {
  eyebrow: "Built for the trades",
  title: "Made for the work you do.",
  subtitle: "Atlas fits the way real service businesses run — pick your trade and feel right at home.",
  items: [
    { icon: "Snowflake", name: "HVAC" },
    { icon: "Drop", name: "Plumbing" },
    { icon: "Lightning", name: "Electrical" },
    { icon: "Plant", name: "Landscaping" },
    { icon: "Leaf", name: "Lawn Care" },
    { icon: "Broom", name: "Cleaning" },
    { icon: "Bug", name: "Pest Control" },
    { icon: "Hammer", name: "Handyman" },
    { icon: "HouseLine", name: "Roofing" },
    { icon: "PaintRoller", name: "Painting" },
  ],
} as const;
