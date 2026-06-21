# syntax=docker/dockerfile:1

# ── Build context = apps/api ─────────────────────────────────────────────────
# NestJS backend. Built in CI and pushed to GHCR; the VPS only pulls + runs.
# Multi-stage so the final image carries no dev deps, no source, no npm cache.

ARG NODE_VERSION=22-alpine

# 1) deps — install all deps from the lockfile (needed to compile).
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2) builder — compile TypeScript to dist/, then drop dev deps.
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
# Declared so the deploy's shared Sentry build args don't warn. Source-map
# upload for the API (sentry-cli) is a follow-up; harmless to pass for now.
ARG SENTRY_ORG
ARG SENTRY_PROJECT
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev

# 3) runner — minimal runtime: prod node_modules + compiled dist only.
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 3000

# Compose/Caddy hit this; also gives the orchestrator a liveness signal.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main"]
