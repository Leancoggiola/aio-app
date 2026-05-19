# Architecture

Monorepo con **pnpm workspaces** y **Turborepo**. Ambas apps siguen la misma convención de estructura de carpetas para facilitar el onboarding.

---

## Estructura del monorepo

```
aio-app/
  apps/
    api/        ← Express API (Node.js + TypeScript)
    web/        ← React SPA (Vite + TypeScript)
  packages/
    shared/     ← Tipos y schemas compartidos entre api y web
    eslint-config/
    typescript-config/
  docs/         ← Esta carpeta
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
    core/                 ← Setup global de la app
      auth/
        AuthContext.tsx   ← Context + useAuth hook
        index.ts
      guards/
        ProtectedRoute.tsx
        GuestRoute.tsx
        index.ts
      layouts/
        RootLayout.tsx    ← Layout con sidebar + header
        AuthLayout.tsx    ← Layout para login
        AnimatedBackground/
        components/       ← Header.tsx, Navbar.tsx
        index.ts
      providers/
        SWRProvider.tsx
        index.ts
      index.ts            ← Barril de core
    features/             ← Módulos de producto
      auth/
        components/       ← AuthCard.tsx
        pages/            ← Login.tsx
        routes/           ← loginRoute.tsx
        index.ts
      home/
        Home.tsx
        homeRoute.tsx
        __tests__/        ← Tests co-locados con la feature
        index.ts
      media/
        components/       ← MediaCard, MediaSearchBar, etc.
        hooks/            ← useMediaSearch, useMyMediaList, etc.
        pages/
        types.ts
        index.ts
      users/
        components/       ← ProfileForm, PasswordForm, etc.
        hooks/            ← useProfile, usePreferences
        pages/            ← Profile.tsx
        routes/           ← profileRoute.tsx
        index.ts
      index.ts            ← Exporta todas las routes
    components/           ← Shared components (entre features)
      index.ts
    hooks/                ← Shared hooks (entre features)
      index.ts
    router.tsx
    routes.tsx
  common/                 ← Utilidades transversales
    api/
      client.ts           ← HTTP client (POST, PUT, PATCH, DELETE)
      fetcher.ts          ← GET fetcher + ApiError class
      index.ts
    index.ts
  theme/
    config.ts             ← Mantine theme config
    components.tsx        ← Mantine component overrides
  assets/
    logo.svg
  __tests__/
    setup.ts              ← Vitest setup global
  main.tsx                ← Entry point
  vite-env.d.ts
```

### Convenciones Web

| Elemento             | Convención                                                  |
| -------------------- | ----------------------------------------------------------- |
| Componentes          | `PascalCase.tsx`, named export (`export const MyComponent`) |
| Hooks                | `camelCase` con prefijo `use`, named export                 |
| Archivos de utilidad | `camelCase.ts`                                              |
| Imports externos     | Aliases (`@/common/api`, `@/core/auth`, `@/features/media`) |

### Path aliases disponibles

| Alias            | Apunta a               |
| ---------------- | ---------------------- |
| `@/*`            | `src/*`                |
| `@/features/*`   | `src/app/features/*`   |
| `@/core/*`       | `src/app/core/*`       |
| `@/components/*` | `src/app/components/*` |
| `@/hooks/*`      | `src/app/hooks/*`      |
| `@/common/*`     | `src/common/*`         |
| `@/theme/*`      | `src/theme/*`          |
| `@/assets/*`     | `src/assets/*`         |

---

## Paralelo Web ↔ API

| Concepto               | API                                         | Web                                                    |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------ |
| Utilidades compartidas | `common/db/`, `common/utils/`               | `common/api/`                                          |
| Módulos de producto    | `auth/`, `media/`, `users/`                 | `features/auth/`, `features/media/`, `features/users/` |
| Setup global           | `config.ts`, `main.ts`                      | `core/`, `main.tsx`                                    |
| Servicios              | `*.service.ts`                              | hooks (`use*.ts`)                                      |
| Validación             | `common/utils/validate.ts` (Zod middleware) | Schemas de `@aio-app/shared`                           |

---

## Agregar una nueva feature

### En API

1. Crear `src/<feature>/`
2. Agregar `<feature>.routes.ts` y `<feature>.service.ts`
3. Registrar el router en `src/router.ts`

### En Web

1. Crear `src/app/features/<feature>/`
2. Estructura interna:
   ```
   <feature>/
     components/
     hooks/
     pages/
     routes/
     types.ts      ← si aplica
     index.ts      ← exportar la route
   ```
3. Exportar la route desde `src/app/features/index.ts`
4. Registrar en `src/app/routes.tsx`

---

## Agregar un shared component o hook (Web)

**Shared component** (usado en 2+ features):

```
src/app/components/
  MyComponent/
    MyComponent.tsx     ← export const MyComponent: FC = ...
    index.ts            ← export { MyComponent } from "./MyComponent"
```

Exportar desde `src/app/components/index.ts`.

**Shared hook** (usado en 2+ features):

```
src/app/hooks/
  useMyHook.ts
```

Exportar desde `src/app/hooks/index.ts`.

> Si el hook o componente es exclusivo de una feature, va dentro de `features/<feature>/hooks/` o `features/<feature>/components/`.

---

## `packages/shared/`

Tipos y schemas compartidos entre API y Web. Ambas apps importan desde `@aio-app/shared`.

```
shared/src/
  auth/     ← LoginPayload, ProfileResponse, User, schemas Zod
  media/    ← MediaItem, tipos de media, schemas
  users/    ← UpdateProfilePayload, UserStats, schemas
  index.ts
```
