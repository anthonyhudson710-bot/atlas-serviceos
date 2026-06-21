# harmony

The **Atlas** SaaS admin console — the authenticated workspace where trade
businesses run their field-service operations (schedule, dispatch, customers,
invoices). Deployed at `harmony.atlasfsm.com`.

Sister app to [`apps/public`](../public) (the marketing site). Same stack —
Next.js (App Router) · React 19 · Tailwind v4 · TypeScript — and the same
evermore design tokens, presented as a **dark Midnight icon rail + light
workspace** admin shell. Clicking a rail icon opens a flyout sheet with that
section's sub-items.

> **Status:** scaffold. The app shell (sidebar + topbar) and a blank Dashboard
> are in place; the remaining sections are stubbed in the nav and not yet built.

## Local development

```bash
cd apps/harmony
npm install
npm run dev        # http://localhost:3000
```

Run the same gates CI runs:

```bash
npm run lint && npm run typecheck && npm run build && npm run test
```

## Structure

```
app/
  layout.tsx        root layout → mounts the AppShell (sidebar + topbar)
  page.tsx          Dashboard (blank state)
  robots.ts         disallow all — this is a private console
components/
  app-shell/        AppNav (client: icon rail + flyout sheet), AppShell, Topbar
  ui/               Button, Card, PageHeader — light-workspace primitives
  Logo.tsx          Atlas spectrum mark + wordmark (mark-only for the rail)
lib/
  app.ts            single source of truth: brand + two-level nav (sections → items)
```

## Deploy

Built in CI and shipped exactly like `apps/public`: GitHub Actions builds the
[`Dockerfile`](Dockerfile) (Next `standalone` output), pushes to GHCR, and the
VPS pulls + runs it behind Caddy at `harmony.atlasfsm.com`. See the root
[README](../../README.md) and [`infra/`](../../infra).
