# app

The **Atlas** product — the core, end-user workspace where trade teams run their
day (schedule, dispatch, jobs, customers, invoices). Deployed at
`app.atlasfsm.com`.

Sister app to [`apps/public`](../public) (marketing) and [`apps/harmony`](../harmony)
(the admin console). Same stack — Next.js (App Router) · React 19 · Tailwind v4 ·
TypeScript — and the same evermore design tokens and admin shell: a **dark
Midnight icon rail beneath a full-width header**, with a flyout sheet of
sub-items when you click a rail icon.

> **Status:** scaffold. The app shell (header + icon rail + flyout sheet) and a
> blank Dashboard are in place; the remaining sections are stubbed in the nav and
> not yet built.

## Local development

```bash
cd apps/app
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
  layout.tsx        root layout → mounts the AppShell (header + rail)
  page.tsx          Dashboard (blank state)
  robots.ts         disallow all — this is a private, authenticated product
components/
  app-shell/        AppNav (client: icon rail + flyout sheet), AppShell, Topbar,
                    MobileMenuButton, nav-context
  ui/               Button, Card, PageHeader — light-workspace primitives
  Logo.tsx          Atlas spectrum mark + wordmark (mark-only for the rail)
lib/
  app.ts            single source of truth: brand + two-level nav (sections → items)
```

## Deploy

Built in CI and shipped exactly like the sibling apps: GitHub Actions builds the
[`Dockerfile`](Dockerfile) (Next `standalone` output), pushes to GHCR, and the
VPS pulls + runs it behind Caddy at `app.atlasfsm.com`. See the root
[README](../../README.md) and [`infra/`](../../infra).
