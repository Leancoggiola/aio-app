# @aio-app/shared

Tipos TypeScript, schemas Zod y constantes compartidas entre la API y el frontend.

Es un **Just-in-Time Package** — exporta TypeScript directo sin paso de build. Los bundlers de las apps consumidoras (Vite para web, tsx/tsup para API) lo compilan.

## Exports

| Path                    | Contenido                                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@aio-app/shared`       | Re-export de todo                                                                                                                                                                        |
| `@aio-app/shared/auth`  | `loginSchema`, `registerSchema` + tipos `LoginPayload`, `RegisterPayload`                                                                                                                |
| `@aio-app/shared/media` | Schemas de media (add, update, search, filter) + tipos (`MediaType`, `MediaStatus`, `MediaItem`, `TmdbMediaResult`, etc.) + constantes (`MEDIA_TYPES`, `MEDIA_STATUSES`, `SEARCH_TYPES`) |

## Uso

```typescript
// Schemas Zod (para validación en API y forms en Web)
import { loginSchema, registerSchema } from '@aio-app/shared/auth';
import { addMediaItemSchema, searchMediaSchema } from '@aio-app/shared/media';

// Tipos TypeScript
import type { LoginPayload, RegisterPayload } from '@aio-app/shared/auth';
import type { MediaItem, MediaType, MediaStatus } from '@aio-app/shared/media';

// Constantes
import { MEDIA_TYPES, MEDIA_STATUSES } from '@aio-app/shared/media';
```

## Scripts

```bash
yarn workspace @aio-app/shared check-types   # Type checking
yarn workspace @aio-app/shared lint           # Linting
```
