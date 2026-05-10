# AIO App (All-In-One)

Monorepo con **Turborepo** para gestionar una aplicación de media tracking personal. Permite buscar películas y series (vía TMDB), agregarlas a tu lista y hacer seguimiento de su estado.

## Tecnologías principales

| Capa | Stack |
|---|---|
| **Backend** | Express 5, TypeScript, Prisma ORM, PostgreSQL (Supabase), Passport.js (JWT) |
| **Frontend** | React 18, Vite, Mantine 8, SWR, React Router 7 |
| **Shared** | Zod schemas, tipos TypeScript compartidos |
| **Tooling** | Turborepo, ESLint, Prettier, tsup |

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
```

## Requisitos previos

- **Node.js** ≥ 18
- **Yarn** 1.x (`npm install -g yarn`)
- **PostgreSQL** — Cuenta de [Supabase](https://supabase.com) (recomendado) o instancia local
- **TMDB API Key** — Obtener en [themoviedb.org](https://www.themoviedb.org/settings/api)

## Setup inicial

```bash
# 1. Clonar e instalar dependencias
git clone <repo-url> && cd aio-app
yarn install

# 2. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
# Editar apps/api/.env con tus credenciales de Supabase, JWT secrets y TMDB API key

# 3. Sincronizar base de datos
cd apps/api
yarn db:migrate       # Crea y aplica migraciones (recomendado)
# o: yarn db:push     # Push directo sin migración (prototipado rápido)

# 4. (Opcional) Explorar la DB visualmente
yarn db:studio
```

## Levantar el proyecto

```bash
# Desde la raíz — levanta API + Web en paralelo con Turborepo
yarn dev

# O individualmente:
yarn dev:api       # Solo API  → http://localhost:3000
yarn dev:web       # Solo Web  → http://localhost:5173
```

> **Nota:** El frontend hace proxy de `/api` hacia `http://localhost:3000` automáticamente (configurado en `vite.config.ts`), por lo que no hay problemas de CORS en desarrollo.

## Scripts principales

| Comando        | Descripción                               |
| -------------- | ----------------------------------------- |
| `yarn dev`     | Levanta API + Web en paralelo (Turborepo) |
| `yarn dev:api` | Solo la API (hot reload con tsx)           |
| `yarn dev:web` | Solo el frontend (Vite dev server)         |
| `yarn build`   | Build de producción de todos los packages  |
| `yarn lint`    | Lint de todo el monorepo                   |
| `yarn format`  | Formateo con Prettier                      |

## Base de datos

La API usa **PostgreSQL** con **Prisma ORM**. El schema se define en `apps/api/prisma/schema.prisma`.

### Modelos

| Modelo | Descripción |
|---|---|
| **User** | Usuarios con autenticación (name, email, password hasheado) |
| **RefreshToken** | Tokens de refresh asociados al usuario (cascade delete) |
| **MediaItem** | Items de media trackeados (unique: userId + tmdbId + mediaType) |

### Comandos de DB (desde `apps/api/`)

| Comando            | Descripción                                      |
| ------------------ | ------------------------------------------------ |
| `yarn db:migrate`  | Crea/aplica migraciones (dev)                    |
| `yarn db:push`     | Pushea el schema directo a la DB (sin migración) |
| `yarn db:studio`   | Abre Prisma Studio en el navegador               |
| `yarn db:generate` | Regenera el Prisma Client                        |

### Flujo de cambios en la DB

1. Editar `prisma/schema.prisma`
2. `yarn db:migrate` → crea una migración y la aplica
3. El Prisma Client se regenera automáticamente
4. Los tipos de TypeScript se actualizan (import desde `@prisma/client`)

## API Endpoints

### Auth (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/register` | ❌ | Registro de usuario (name, email, password) |
| `POST` | `/login` | ❌ | Login con email/password → access token + refresh cookie |
| `POST` | `/refresh` | 🔄 Cookie | Renueva el access token usando el refresh token |
| `POST` | `/logout` | 🔒 JWT | Invalida el refresh token y limpia la cookie |
| `GET` | `/profile` | 🔒 JWT | Retorna datos del usuario autenticado |

### Media (`/api/media`) — Todas requieren JWT

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/search?query=&page=&type=` | Busca en TMDB (movie, tv, multi) |
| `GET` | `/tmdb/:type/:id` | Detalle de un item en TMDB |
| `GET` | `/list?status=&mediaType=` | Lista de media del usuario (con filtros) |
| `POST` | `/list` | Agrega un item a la lista |
| `PATCH` | `/list/:id` | Actualiza el estado de un item |
| `DELETE` | `/list/:id` | Elimina un item de la lista |

## Variables de entorno

Ver `apps/api/.env.example` para la lista completa.

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | Connection string PostgreSQL (pooler) |
| `DIRECT_URL` | ✅ | — | Connection string directa (para migraciones) |
| `JWT_ACCESS_SECRET` | ✅ | — | Secret para firmar access tokens |
| `JWT_REFRESH_SECRET` | ✅ | — | Secret para firmar refresh tokens |
| `TMDB_API_KEY` | ✅ | — | API key de TMDB |
| `PORT` | ❌ | `3000` | Puerto del servidor |
| `CORS_ORIGIN` | ❌ | `true` (todos) | Origen permitido para CORS |
| `JWT_ACCESS_EXPIRES_IN` | ❌ | `15m` | Expiración del access token |
| `JWT_REFRESH_EXPIRES_IN` | ❌ | `7d` | Expiración del refresh token |
| `COOKIE_REFRESH_MAX_AGE` | ❌ | `604800` (7 días) | Max age de la cookie en segundos |

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
