# api

Shared NestJS backend for the Atlas apps (public, app, harmony) and the custom
IAM/login service.

- **`api.atlasfsm.com`** — the API the three UIs consume.
- **`iam.atlasfsm.com`** — shared login. A session cookie is issued for
  `.atlasfsm.com`, so a single sign-in covers both `app.` and `harmony.`.

## Stack

NestJS 11 · TypeORM + PostgreSQL · JWT session cookie · `@sentry/nestjs`.

## Scripts

```bash
npm run start:dev   # watch mode (needs a local Postgres — see env below)
npm run build       # nest build -> dist/
npm run start       # node dist/main
npm run lint
npm run typecheck
npm run test
```

## Environment

| Var | Purpose | Default (dev) |
|-----|---------|---------------|
| `PORT` | Listen port | `3000` |
| `DB_HOST` / `DB_PORT` | Postgres host/port | `localhost` / `5432` |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | DB credentials | `atlas` / `atlas` / `atlas` |
| `JWT_SECRET` | Session signing secret. **Required in production** | dev fallback |
| `COOKIE_DOMAIN` | Session cookie domain | unset (host-only) → `.atlasfsm.com` in prod |
| `CORS_ORIGINS` | Comma-separated allowed origins (credentialed) | localhost |
| `SENTRY_DSN` | Override the committed serviceos-api DSN | committed default |
| `SENTRY_ENABLED` | Force Sentry on/off: `"true"` \| `"false"` | unset → on in prod, off in dev |

## Endpoints

- `GET /health` — liveness
- `GET /debug-sentry` — throws on purpose (Sentry verification)
- `GET /login` — the shared login page (served at `iam.atlasfsm.com/login`)
- `POST /auth/register` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/me`

> The `synchronize` TypeORM option auto-creates the schema. Switch to committed
> migrations before there's production data you can't afford to lose.
