# syntax=docker/dockerfile:1

# Custom Caddy build = stock Caddy + the Cloudflare DNS provider module, so TLS
# certs are issued/renewed via the ACME DNS-01 challenge (a DNS TXT record)
# instead of HTTP. That works even when the domains are proxied through
# Cloudflare, so we never have to grey-cloud records to issue certs again.
#
# Built + pushed to GHCR by CI (deploy.yml); the VPS only pulls + runs it.

FROM caddy:2-builder AS builder
RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare

FROM caddy:2-alpine
# Replace the stock binary with our plugin-enabled build; everything else
# (entrypoint, default config path) comes from the base image.
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
