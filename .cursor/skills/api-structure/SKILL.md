---
name: api-structure
description: Folder structure and conventions for apps/api (Express features, Prisma, validation). Use when creating or modifying routes, services, or features under apps/api/src. Triggers on auth.routes, media.service, router.ts, validate middleware, or new API feature.
---

# API structure — aio-app

## Layout

```
apps/api/src/
  common/db/          prisma singleton
  common/utils/       validate, logger, error-handler
  <feature>/
    <feature>.routes.ts
    <feature>.service.ts
  config.ts
  main.ts
  router.ts
```

Features actuales: `auth`, `media`, `users`, `admin`.

## Nuevo feature

1. Crear `src/<feature>/<feature>.routes.ts` y `<feature>.service.ts`
2. `router.use('/<feature>', featureRoutes)` en `router.ts`
3. Schemas en `packages/shared/src/<domain>/` si el contrato es compartido con web
4. Tests en `src/__tests__/` si hay lógica en utils o schemas críticos

## Service vs routes

- **routes:** HTTP, `validate`, middleware auth, `res.json`, `next(err)`
- **service:** Prisma, TMDB, reglas de negocio, sin `req`/`res`

## Prisma

Schema: `apps/api/prisma/schema.prisma`. Cliente: `import { prisma } from '../common/db'`. No editar `src/generated/`.

Migraciones desde `apps/api/`: `pnpm db:migrate`. Ver `docs/prisma.md`.

## Rate limiting

Patrón existente en `auth.routes.ts`, `media.routes.ts`, `users.routes.ts` — reutilizar para endpoints sensibles.

## Docs

- `docs/architecture.md` — paralelo Web ↔ API
- `.cursor/rules/api-conventions.mdc`
