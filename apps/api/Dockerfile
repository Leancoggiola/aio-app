# ── Stage 1: Base ──────────────────────────────────────────────
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
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
RUN pnpm --filter=api deploy --prod --legacy /app/deployed

# ── Stage 5: Runner ───────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:appgroup /app/deployed/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/deployed/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/deployed/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/deployed/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/apps/api/src/generated ./src/generated

ENV NODE_ENV=production
EXPOSE 3000

USER appuser

CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/main.js"]
