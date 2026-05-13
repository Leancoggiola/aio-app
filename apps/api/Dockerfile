# ── Stage 1: Base ──────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
RUN apk add --no-cache libc6-compat

# ── Stage 2: Prune monorepo ───────────────────────────────────
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@2.9.12
COPY . .
RUN turbo prune api --docker

# ── Stage 3: Install dependencies ─────────────────────────────
FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# ── Stage 4: Build ────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

RUN pnpm turbo build --filter=api

# ── Stage 5: Runner ───────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:appgroup /app/apps/api/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/apps/api/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/apps/api/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=appuser:appgroup /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/apps/api/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

USER appuser

CMD ["node", "dist/main.js"]
