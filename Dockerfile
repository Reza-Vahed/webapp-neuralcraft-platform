# syntax=docker/dockerfile:1

# Multi-stage build: only the final "runner" stage ships in the image.
# Node version matches package.json's "engines" field and Next.js 16's
# minimum (>=20.9) — see DEPLOYMENT.md.

# ---------------------------------------------------------------------------
# Stage 1: deps — installs all dependencies (incl. devDependencies, needed
# for the build tooling below) in their own layer, so this only re-runs when
# package.json/package-lock.json change, not on every source edit.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Skips Husky's git-hook install (harmless without .git, but explicit is
# faster and avoids relying on that fallback — see IA.md).
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2: builder — compiles Velite content collections and runs the
# Next.js production build (standalone output, see next.config.ts).
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NODE_ENV must be "production" *before* the build runs: next.config.ts uses
# it to decide Velite's build mode (a one-shot build vs. a watcher that never
# exits — see next.config.ts#enableVelite), and Next.js itself uses it for
# the production compiler pipeline.
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Baked into the image so /api/health can report when it was built (see
# app/api/health/route.ts). Pass at build time with:
#   docker build --build-arg BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)" .
ARG BUILD_TIME=unknown
ENV BUILD_TIME=${BUILD_TIME}

# NEXT_PUBLIC_* values are inlined into the client bundle/prerendered HTML
# at build time, so they must be available now, not just at container
# start — see .env.production.example. Defaults keep the build working even
# when none are supplied (e.g. CI's lint/typecheck/build-only workflow).
# NEXT_PUBLIC_SITE_URL specifically needs a real (non-empty) URL, not just
# an empty string — lib/site.ts falls back to this same value when unset,
# but generateMetadata's `new URL(siteUrl)` throws on an empty string, which
# is exactly what an *empty but defined* build-arg would otherwise produce.
ARG NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ARG NEXT_PUBLIC_ANALYTICS_PROVIDER=""
ENV NEXT_PUBLIC_ANALYTICS_PROVIDER=${NEXT_PUBLIC_ANALYTICS_PROVIDER}
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN=""
ENV NEXT_PUBLIC_ANALYTICS_DOMAIN=${NEXT_PUBLIC_ANALYTICS_DOMAIN}
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID=""
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=${NEXT_PUBLIC_UMAMI_WEBSITE_ID}
ARG NEXT_PUBLIC_UMAMI_SCRIPT_URL=""
ENV NEXT_PUBLIC_UMAMI_SCRIPT_URL=${NEXT_PUBLIC_UMAMI_SCRIPT_URL}
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3: runner — minimal runtime image. Only the traced standalone output
# is copied in (see next.config.ts's `output: "standalone"`); no node_modules,
# no source, no devDependencies, no build tooling.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user — never run the production server as root. BusyBox's
# adduser (Alpine) needs an explicit -G, otherwise it silently assigns its
# own default group instead of joining "nodejs" (verified: without -G, `id`
# inside the container reports gid=nogroup, not nodejs).
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 -G nodejs nextjs

# Static assets first (rarely change relative to the standalone server code
# below, though both are cheap here since this is the final stage anyway).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ARG BUILD_TIME=unknown
ENV BUILD_TIME=${BUILD_TIME}

USER nextjs

EXPOSE 3000
ENV PORT=3000
# Required for the server to be reachable from outside the container — the
# standalone server.js binds to `localhost` by default otherwise.
ENV HOSTNAME=0.0.0.0

# Node-only healthcheck (no curl/wget in the base image, keeps it small) —
# hits the same endpoint external monitoring should use (see DEPLOYMENT.md).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "require('http').get('http://127.0.0.1:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]

CMD ["node", "server.js"]
