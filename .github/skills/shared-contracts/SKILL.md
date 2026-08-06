---
name: shared-contracts
description: Zod schemas and types in packages/shared (@omni/shared) shared by API and web. Use when adding or changing request/response payloads, enums, or validation used on both apps/api and apps/web.
---

# Shared contracts — @omni/shared

## Layout

```
packages/shared/src/
  auth/       schemas + types (login, session, createUser)
  media/      MEDIA_TYPES, MEDIA_STATUSES, add/update/search schemas
  users/      profile, password, preferences
  theme/      BRAND, SEMANTIC, GRAY, success/destructive (web + mobile)
  index.ts    re-exports
```

## Reglas

1. **Un schema, dos+ consumidores** — API (`validate(schema)`) y clientes web/mobile (`schemaResolver` / tipos de respuesta).
2. **Labels de UI en español** pueden vivir en shared (`MEDIA_STATUS_LABELS`) si son estables.
3. **Validación solo de un cliente** (ej. confirmar contraseña en web): `.extend()` / `.refine()` en ese feature, no en shared.
4. Cambio breaking → actualizar API + clientes afectados + tests en el mismo PR.
5. **Auth dual:** login/refresh responden `AuthTokensResponse` (user + tokens). Web ignora tokens (cookies); mobile los persiste.
6. **Colores de marca** — solo en `@omni/shared/theme`. Web (Mantine) y mobile (Tamagui) mapean; no hex de marca sueltos en features.

## Orden de implementación

```
packages/shared  →  apps/api (routes/service)  →  apps/web y/o apps/mobile (keys, hooks, UI)
```

## Web

- Import: `import { addMediaItemSchema } from '@omni/shared/media'`
- No confundir con `@/shared` (cliente HTTP en web)

## API

- Import: `import { addMediaItemSchema } from '@omni/shared/media'`
- `validate(addMediaItemSchema)` o `validate(schema, 'query')`

## Docs

`docs/architecture.md` (sección `packages/shared/`)
