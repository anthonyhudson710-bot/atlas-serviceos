# atlas-serviceos

Monorepo for Atlas. Each app is a self-contained codebase under `apps/` and
deploys as its own container behind a shared [Caddy](https://caddyserver.com)
reverse proxy.

| App | Path | Domain |
| --- | --- | --- |
| Public marketing site | [`apps/public`](apps/public) | `www.atlasfsm.com` (apex redirects to www) |
| Harmony — admin console | [`apps/harmony`](apps/harmony) | `harmony.atlasfsm.com` |
| App — core product | [`apps/app`](apps/app) | `app.atlasfsm.com` |

Each app is a self-contained Next.js codebase that builds to its own image and
attaches as a subdomain — see [Adding an app](#adding-an-app).

## How deploys work

```
push to main ─▶ GitHub Actions ─▶ build image ─▶ push to GHCR ─▶ ssh VPS: docker compose pull && up -d
```

- **Build happens in CI, not on the server.** The VPS only pulls a prebuilt
  image and runs it, so it needs no build resources.
- Images use Next.js [`standalone`](apps/public/next.config.ts) output, so the
  runtime image carries no `node_modules` or source — just the server bundle.
- The VPS runs the [`infra/`](infra) compose stack: Caddy (auto-HTTPS) + the
  app containers. Caddy is the only thing exposed to the internet (ports 80/443).

### Pipelines

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — every PR: `lint → typecheck → build → test`.
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — merge to `main`: re-run gates → build & push image → SSH deploy.

Required GitHub repo secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`
(GHCR push uses the built-in `GITHUB_TOKEN`).

## Local development

```bash
cd apps/public
npm install
npm run dev        # http://localhost:3000
```

Run the same gates CI runs:

```bash
npm run lint && npm run typecheck && npm run build && npm run test
```

Build and run the production image locally:

```bash
docker build -t atlas-public apps/public
docker run --rm -p 3000:3000 atlas-public
```

## Adding an app

1. Scaffold it under `apps/<name>/` with its own `Dockerfile`
   (copy `apps/harmony/Dockerfile` as a starting point — it has no app-specific
   volumes, unlike `apps/public`).
2. Add a service to [`infra/docker-compose.yml`](infra/docker-compose.yml) and a
   site block to [`infra/Caddyfile`](infra/Caddyfile) for `<name>.atlasfsm.com`.
3. Add `<name>` to the `app` matrix in both
   [`ci.yml`](.github/workflows/ci.yml) and
   [`deploy.yml`](.github/workflows/deploy.yml) — that covers the gates and the
   image build at once.
4. Add an A record for the subdomain in Cloudflare.
