# AIO App (All-In-One)

Monorepo con **Turborepo** para gestionar una aplicación de media tracking personal. Permite buscar películas y series (vía TMDB), agregarlas a tu lista y hacer seguimiento de su estado.

## Tecnologías principales

| Capa         | Stack                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| **Backend**  | Express 5, TypeScript, Prisma ORM, PostgreSQL (Supabase), Passport.js (JWT) |
| **Frontend** | React 18, Vite, Mantine 8, SWR, React Router 7                              |
| **Shared**   | Zod schemas, tipos TypeScript compartidos                                   |
| **Tooling**  | Turborepo, pnpm, ESLint, Prettier, tsup                                     |

## Desarrollo con agentes (Cursor)

- [AGENTS.md](./AGENTS.md) — índice del proyecto (reglas de oro, skills, verificación)
- [docs/codegraph.md](./docs/codegraph.md) — exploración del código (`pnpm codegraph:init`, MCP **codegraph**)

## Estructura del monorepo

```
apps/
  api/              → API REST (Express + Prisma + PostgreSQL)
  web/              → Frontend SPA (React + Vite + Mantine)
packages/
  shared/           → Schemas Zod, tipos y constantes compartidas entre API y Web
  ui/               → Componentes UI reutilizables (Mantine-based)
  eslint-config/    → Configuración compartida de ESLint
  typescript-config/ → tsconfig bases compartidos
docs/                 → Arquitectura y guías
AGENTS.md             → Guía para agentes de IA
.cursor/rules/        → Convenciones Cursor (incl. AGENTS.md)
.cursor/skills/       → Skills del proyecto (SWR, API, shared)
.agents/skills/       → Skills de terceros (Mantine, Supabase)
.codegraph/           → Índice CodeGraph (local)
```

## Requisitos previos

- **Node.js** ≥ 18
- **pnpm** ≥ 10 (`corepack enable` para activarlo automáticamente)
- **PostgreSQL** — Cuenta de [Supabase](https://supabase.com) (recomendado) o instancia local
- **TMDB API Key** — Obtener en [themoviedb.org](https://www.themoviedb.org/settings/api)

## Setup inicial

```bash
# 1. Clonar e instalar dependencias
git clone <repo-url> && cd aio-app
pnpm install

# 2. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
# Editar apps/api/.env con tus credenciales de Supabase, JWT secrets y TMDB API key

# 3. Sincronizar base de datos
cd apps/api
pnpm db:migrate       # Crea y aplica migraciones (recomendado)
# o: pnpm db:push     # Push directo sin migración (prototipado rápido)

# 4. (Opcional) Explorar la DB visualmente
pnpm db:studio
```

## Levantar el proyecto

```bash
# Desde la raíz — levanta API + Web en paralelo con Turborepo
pnpm dev

# O individualmente:
pnpm dev:api       # Solo API  → http://localhost:3000
pnpm dev:web       # Solo Web  → http://localhost:5173
```

> **Nota:** El frontend hace proxy de `/api` hacia `http://localhost:3000` automáticamente (configurado en `vite.config.ts`), por lo que no hay problemas de CORS en desarrollo.

## Scripts principales

| Comando        | Descripción                               |
| -------------- | ----------------------------------------- |
| `pnpm dev`     | Levanta API + Web en paralelo (Turborepo) |
| `pnpm dev:api` | Solo la API (hot reload con tsx)          |
| `pnpm dev:web` | Solo el frontend (Vite dev server)        |
| `pnpm build`   | Build de producción de todos los packages |
| `pnpm lint`    | Lint de todo el monorepo                  |
| `pnpm format`  | Formateo con Prettier                     |

## Base de datos

La API usa **PostgreSQL** con **Prisma ORM**. El schema se define en `apps/api/prisma/schema.prisma`.

### Modelos

| Modelo           | Descripción                                                     |
| ---------------- | --------------------------------------------------------------- |
| **User**         | Usuarios con autenticación (name, email, password hasheado)     |
| **RefreshToken** | Tokens de refresh asociados al usuario (cascade delete)         |
| **MediaItem**    | Items de media trackeados (unique: userId + tmdbId + mediaType) |

### Comandos de DB (desde `apps/api/`)

| Comando            | Descripción                                      |
| ------------------ | ------------------------------------------------ |
| `pnpm db:migrate`  | Crea/aplica migraciones (dev)                    |
| `pnpm db:push`     | Pushea el schema directo a la DB (sin migración) |
| `pnpm db:studio`   | Abre Prisma Studio en el navegador               |
| `pnpm db:generate` | Regenera el Prisma Client                        |

### Flujo de cambios en la DB

1. Editar `prisma/schema.prisma`
2. `pnpm db:migrate` → crea una migración y la aplica
3. El Prisma Client se regenera automáticamente
4. Los tipos de TypeScript se actualizan (import desde `@prisma/client`)

## API Endpoints

### Auth (`/api/auth`)

| Método | Ruta        | Auth      | Descripción                                              |
| ------ | ----------- | --------- | -------------------------------------------------------- |
| `POST` | `/register` | ❌        | Registro de usuario (name, email, password)              |
| `POST` | `/login`    | ❌        | Login con email/password → access token + refresh cookie |
| `POST` | `/refresh`  | 🔄 Cookie | Renueva el access token usando el refresh token          |
| `POST` | `/logout`   | 🔒 JWT    | Invalida el refresh token y limpia la cookie             |
| `GET`  | `/profile`  | 🔒 JWT    | Retorna datos del usuario autenticado                    |

### Media (`/api/media`) — Todas requieren JWT

| Método   | Ruta                         | Descripción                              |
| -------- | ---------------------------- | ---------------------------------------- |
| `GET`    | `/search?query=&page=&type=` | Busca en TMDB (movie, tv, multi)         |
| `GET`    | `/tmdb/:type/:id`            | Detalle de un item en TMDB               |
| `GET`    | `/list?status=&mediaType=`   | Lista de media del usuario (con filtros) |
| `POST`   | `/list`                      | Agrega un item a la lista                |
| `PATCH`  | `/list/:id`                  | Actualiza el estado de un item           |
| `DELETE` | `/list/:id`                  | Elimina un item de la lista              |

## Variables de entorno

Ver `apps/api/.env.example` para la lista completa.

| Variable                 | Requerida | Default           | Descripción                                  |
| ------------------------ | --------- | ----------------- | -------------------------------------------- |
| `DATABASE_URL`           | ✅        | —                 | Connection string PostgreSQL (pooler)        |
| `DIRECT_URL`             | ✅        | —                 | Connection string directa (para migraciones) |
| `JWT_ACCESS_SECRET`      | ✅        | —                 | Secret para firmar access tokens             |
| `JWT_REFRESH_SECRET`     | ✅        | —                 | Secret para firmar refresh tokens            |
| `TMDB_API_KEY`           | ✅        | —                 | API key de TMDB                              |
| `PORT`                   | ❌        | `3000`            | Puerto del servidor                          |
| `CORS_ORIGIN`            | ❌        | `true` (todos)    | Origen permitido para CORS                   |
| `JWT_ACCESS_EXPIRES_IN`  | ❌        | `15m`             | Expiración del access token                  |
| `JWT_REFRESH_EXPIRES_IN` | ❌        | `7d`              | Expiración del refresh token                 |
| `COOKIE_REFRESH_MAX_AGE` | ❌        | `604800` (7 días) | Max age de la cookie en segundos             |

## Arquitectura de autenticación

```
Login → Passport Local Strategy → bcrypt verify
  ↓
Access Token (JWT, header) + Refresh Token (JWT, HttpOnly cookie)
  ↓
Rutas protegidas → Passport JWT Strategy → req.user.userId
  ↓
Token expirado → POST /refresh → Passport JWT Refresh Strategy → nuevos tokens
```
