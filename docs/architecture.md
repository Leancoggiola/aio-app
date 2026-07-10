# Architecture

Monorepo con **pnpm workspaces** y **Turborepo**. Ambas apps siguen la misma convención de estructura de carpetas para facilitar el onboarding.

**Agentes:** [AGENTS.md](../AGENTS.md) · [web-tooling.md](./web-tooling.md) · [codegraph.md](./codegraph.md).

---

## Estructura del monorepo

```
omni/
  apps/
    api/        ← Express API (Node.js + TypeScript)
    web/        ← React SPA (Vite + TypeScript)
    mobile/     ← Expo Android (Router + Tamagui)
  packages/
    shared/     ← Tipos y schemas compartidos (@omni/shared)
    eslint-config/
    typescript-config/
  docs/         ← Esta carpeta
  AGENTS.md       ← Índice para agentes de IA
  .cursor/rules/  ← Convenciones automáticas (web, mobile, api, project-agents)
  .cursor/skills/ ← Skills del proyecto (web, mobile, API, shared)
  .agents/skills/ ← Skills de terceros (Mantine, Supabase; npx skills)
  .codegraph/     ← Índice CodeGraph (local, no commitear *.db)
```

---

## `apps/api/src/`

```
src/
  common/                 ← Utilidades transversales
    db/
      prisma.ts           ← PrismaClient singleton
      index.ts
    utils/
      logger.ts           ← Pino logger
      error-handler.ts    ← Express error handler middleware
      validate.ts         ← Zod validation middleware
      index.ts
    index.ts              ← Barril: re-exporta db + utils
  auth/                   ← Feature: autenticación
    middleware/
    strategies/           ← Passport strategies (local, jwt, jwt-refresh)
    auth.routes.ts
    auth.service.ts
  admin/                  ← Feature: administración
    admin.routes.ts
    admin.service.ts
  media/                  ← Feature: media tracker
    media.routes.ts
    media.service.ts
    tmdb.service.ts
  users/                  ← Feature: usuarios y perfil
    users.routes.ts
    users.service.ts
    stats.service.ts
  generated/
    prisma/               ← Cliente Prisma generado (no editar)
  config.ts               ← Variables de entorno validadas
  main.ts                 ← Bootstrap de Express
  router.ts               ← Router principal
  __tests__/              ← Tests de utilidades comunes
```

### Convenciones API

| Carpeta/archivo  | Convención                                                     |
| ---------------- | -------------------------------------------------------------- |
| Cada feature     | `feature.routes.ts` + `feature.service.ts`                     |
| Imports de DB    | `import { prisma } from "../common/db"`                        |
| Imports de utils | `import { validate, logger } from "../common/utils"`           |
| Naming           | `camelCase` para funciones, `PascalCase` para interfaces/types |

---

## `apps/web/src/`

```
src/
  app/
    router.tsx
    routes.ts
    navigation/
      nav-registry.tsx
  features/               ← Dominio de producto (1 navbar item = 1 feature)
    home/
    auth/
    media/
    profile/              ← UI “Perfil”; API sigue en users/
  shared/
    api/                  ← client, fetcher, SWR_KEYS
    ui/                   ← componentes cross-feature (UserAvatar, …)
  core/
    auth/
    guards/
    providers/
  layouts/
    RootLayout.tsx
    AuthLayout.tsx
    components/           ← Navbar, Header, …
  theme/
  assets/
  main.tsx
```

Cada feature usa `modules/<nombre>/` (sub-dominios), carpetas por componente/hook y barrels `index.ts`. Ver [web-new-feature.md](./web-new-feature.md).

### Convenciones Web

| Elemento     | Convención                                               |
| ------------ | -------------------------------------------------------- |
| Feature      | `<name>.page.tsx`, `<name>.routes.tsx`, `<name>.nav.tsx` |
| Componentes  | `Component/Component.tsx` + `index.ts`                   |
| Hooks        | `useX/useX.ts` + `index.ts`                              |
| Imports      | `@/shared/api`, `@/core/auth`, `@/features/media`        |
| Dependencias | Un feature **no** importa otro feature                   |

### Path aliases

| Alias          | Apunta a         |
| -------------- | ---------------- |
| `@/*`          | `src/*`          |
| `@/app/*`      | `src/app/*`      |
| `@/features/*` | `src/features/*` |
| `@/shared/*`   | `src/shared/*`   |
| `@/core/*`     | `src/core/*`     |
| `@/layouts/*`  | `src/layouts/*`  |
| `@/theme/*`    | `src/theme/*`    |
| `@/assets/*`   | `src/assets/*`   |

> `@/shared` (frontend) ≠ `@omni/shared` (paquete monorepo de tipos/schemas).

---

## Paralelo Web ↔ API

| Concepto               | API                                         | Web                                                      |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------- |
| Utilidades compartidas | `common/db/`, `common/utils/`               | `shared/api/`                                            |
| Módulos de producto    | `auth/`, `media/`, `users/`                 | `features/auth/`, `features/media/`, `features/profile/` |
| Setup global           | `config.ts`, `main.ts`                      | `core/`, `layouts/`, `main.tsx`                          |
| Servicios              | `*.service.ts`                              | hooks en `features/*/modules/*/hooks/`                   |
| Validación             | `common/utils/validate.ts` (Zod middleware) | Schemas de `@omni/shared`                                |
| Auth                   | Cookie **o** Bearer JWT                     | Cookies `httpOnly` + `credentials: 'include'`            |

### Auth dual (web + mobile)

`POST /api/auth/login` y `POST /api/auth/refresh`:

- Siempre setean cookies (compat web).
- Siempre incluyen `accessToken` y `refreshToken` en el JSON (`AuthTokensResponse` en `@omni/shared/auth`).
- Rutas protegidas: Passport acepta cookie `access_token` **o** header `Authorization: Bearer`.
- Refresh: cookie `refresh_token`, Bearer, o body `{ refreshToken }` (`refreshTokenBodySchema`).
- Logout: access por cookie/Bearer; refresh a revocar por cookie o body.

Web ignora los tokens del body. Mobile los guarda (SecureStore) y no depende de cookies.

---

## Agregar una nueva feature

### En API

1. Crear `src/<feature>/`
2. Agregar `<feature>.routes.ts` y `<feature>.service.ts`
3. Registrar el router en `src/router.ts`

### En Web

1. `pnpm web:new-feature <name>` o seguir [web-new-feature.md](./web-new-feature.md)
2. Registrar route en `app/routes.ts` y nav en `app/navigation/nav-registry.tsx`
3. Keys SWR en `shared/api/keys.ts` si aplica

Tooling: [web-tooling.md](./web-tooling.md) (Cursor rule + script).

---

## Shared UI (Web)

Componentes usados en 2+ features → `shared/ui/<Component>/`.

Hooks cross-feature (si aparecen) → `shared/hooks/` (crear cuando haga falta).

---

## `packages/shared/`

Tipos y schemas compartidos entre API, Web y Mobile. Importan desde `@omni/shared`.

```
shared/src/
  auth/     ← LoginPayload, ProfileResponse, User, schemas Zod
  media/    ← MediaItem, tipos de media, schemas
  users/    ← UpdateProfilePayload, UserStats, schemas
  index.ts
```
