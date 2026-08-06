# @omni/shared

Tipos TypeScript, schemas Zod y constantes compartidas entre la API y el frontend.

Es un **Just-in-Time Package** — exporta TypeScript directo sin paso de build. Los bundlers de las apps consumidoras (Vite para web, tsx/tsup para API) lo compilan.

## Exports

| Path                 | Contenido                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `@omni/shared`       | Re-export de todo                                                                               |
| `@omni/shared/auth`  | `loginSchema`, `registerSchema` + tipos `LoginPayload`, `RegisterPayload`                       |
| `@omni/shared/media` | Schemas de media (add, update, search, filter) + tipos (`MediaItem`, etc.) + constantes         |
| `@omni/shared/theme` | `BRAND`, `SEMANTIC`, `GRAY`, `SUCCESS`, `DESTRUCTIVE` — fuente única de color para web y mobile |
| `@omni/shared/users` | Profile / preferences schemas                                                                   |

## Uso

```typescript
// Schemas Zod (para validación en API y forms en Web)
import { loginSchema, registerSchema } from '@omni/shared/auth';
import { addMediaItemSchema, searchMediaSchema } from '@omni/shared/media';

// Tipos TypeScript
import type { LoginPayload, RegisterPayload } from '@omni/shared/auth';
import type { MediaItem, MediaType, MediaStatus } from '@omni/shared/media';

// Constantes
import { MEDIA_TYPES, MEDIA_STATUSES } from '@omni/shared/media';
```

## Scripts

```bash
yarn workspace @omni/shared check-types   # Type checking
yarn workspace @omni/shared lint           # Linting
```
