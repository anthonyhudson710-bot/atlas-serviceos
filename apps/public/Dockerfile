# syntax=docker/dockerfile:1

# ── Build context = apps/public ──────────────────────────────────────────────
# Built in CI and pushed to GHCR; the VPS only pulls + runs this image.
# Multi-stage so the final image carries no source, no dev deps, no npm cache.

ARG NODE_VERSION=22-alpine

# 1) deps — install production-resolved node_modules from the lockfile only.
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2) builder — compile the Next standalone bundle.
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) runner — minimal runtime: just the standalone server + static assets.
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as the unprivileged 'node' user that ships with the base image.
# standalone/server.js needs to read these dirs, so chown them.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Writable sink for the waitlist store. A named volume mounted here inherits
# this ownership on first creation, so the non-root 'node' user can append.
RUN mkdir -p /data && chown node:node /data
VOLUME /data
ENV WAITLIST_STORE_PATH=/data/waitlist.jsonl

USER node
EXPOSE 3000

# Compose/Caddy hit this; also gives the orchestrator a liveness signal.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
