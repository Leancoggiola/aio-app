---
name: shared-contracts
description: Zod schemas and types in packages/shared (@aio-app/shared) shared by API and web. Use when adding or changing request/response payloads, enums, or validation used on both apps/api and apps/web.
---

# Shared contracts — @aio-app/shared

## Layout

```
packages/shared/src/
  auth/       schemas + types (login, session, createUser)
  media/      MEDIA_TYPES, MEDIA_STATUSES, add/update/search schemas
  users/      profile, password, preferences
  index.ts    re-exports
```

## Reglas

1. **Un schema, dos consumidores** — API (`validate(schema)`) y web (`schemaResolver` / tipos de respuesta).
2. **Labels de UI en español** pueden vivir en shared (`MEDIA_STATUS_LABELS`) si son estables.
3. **Validación solo web** (ej. confirmar contraseña): `.extend()` / `.refine()` en el feature web, no en shared.
4. Cambio breaking → actualizar API + web + tests en el mismo PR.

## Orden de implementación

```
packages/shared  →  apps/api (routes/service)  →  apps/web (SWR_KEYS, hooks, forms)
```

## Web

- Import: `import { addMediaItemSchema } from '@aio-app/shared/media'`
- No confundir con `@/shared` (cliente HTTP en web)

## API

- Import: `import { addMediaItemSchema } from '@aio-app/shared/media'`
- `validate(addMediaItemSchema)` o `validate(schema, 'query')`

## Docs

`docs/architecture.md` (sección `packages/shared/`)
