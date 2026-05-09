# API

API REST construida con **Express 5**, **TypeScript**, **Prisma** y **PostgreSQL**.

## Stack

- **Express 5** — HTTP framework
- **Prisma** — ORM y migraciones
- **PostgreSQL** — Base de datos relacional
- **Passport.js** — Autenticación (JWT + cookies HttpOnly)
- **Zod** — Validación de payloads (schemas en `@aio-app/shared`)
- **tsup** — Bundler para producción
- **tsx** — Runner para desarrollo (watch mode)

## Estructura de carpetas

```
apps/api/
├── prisma/
│   └── schema.prisma        # Modelos de la DB (source of truth)
├── src/
│   ├── main.ts              # Entry point (Express app + Prisma connect)
│   ├── config.ts            # Variables de entorno centralizadas
│   ├── router.ts            # Router principal (monta sub-routers)
│   ├── lib/
│   │   └── prisma.ts        # Singleton del Prisma Client
│   ├── middleware/
│   │   └── error-handler.ts # Middleware global de errores
│   ├── auth/
│   │   ├── auth.routes.ts   # Rutas: register, login, refresh, logout, profile
│   │   ├── auth.service.ts  # Lógica de negocio (JWT, bcrypt, refresh tokens)
│   │   ├── middleware/       # Middlewares específicos de auth
│   │   └── strategies/      # Passport strategies (local, jwt, jwt-refresh)
│   ├── media/
│   │   ├── media.routes.ts  # Rutas: search, detail, list CRUD
│   │   ├── media.service.ts # Lógica de negocio (Prisma queries)
│   │   └── tmdb.service.ts  # Integración con TMDB API
│   └── users/
│       └── users.service.ts # Queries de usuario (create, findByEmail, findById)
├── docker-compose.yml        # PostgreSQL local
├── tsup.config.ts            # Config de build
└── .env.example              # Variables de entorno ejemplo
```

## Prisma

### Schema

El archivo `prisma/schema.prisma` es el **source of truth** de la estructura de la base de datos. Define 3 modelos:

- **User** — Usuarios con autenticación (name, email, password hasheado)
- **RefreshToken** — Tokens de refresh asociados al usuario (cascade delete)
- **MediaItem** — Items de media trackeados por el usuario (unique compound: userId + tmdbId + mediaType)

### Prisma Client

Se usa un singleton en `src/lib/prisma.ts` que se importa en los services:

```ts
import { prisma } from '../lib/prisma';

// Ejemplo de query
const user = await prisma.user.findUnique({ where: { email } });
```

### Comandos

```bash
# Crear una migración después de editar schema.prisma
yarn db:migrate

# Push directo sin migración (dev rápido, resetea datos)
yarn db:push

# Regenerar el client (se hace automático en migrate/push)
yarn db:generate

# UI visual para explorar/editar datos
yarn db:studio
```

### Flujo para agregar/modificar un modelo

1. Editar `prisma/schema.prisma`
2. Ejecutar `yarn db:migrate` (te pide un nombre para la migración)
3. El Prisma Client se regenera automáticamente
4. Los tipos de TypeScript se actualizan (import desde `@prisma/client`)

### Diferencia entre migrate y push

| | `db:migrate` | `db:push` |
|---|---|---|
| Crea archivo de migración | ✅ | ❌ |
| Historial de cambios | ✅ | ❌ |
| Puede resetear datos | Solo si es necesario | Siempre que haya breaking changes |
| Uso recomendado | Desarrollo normal / producción | Prototipado rápido |

## Levantar

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Configurar env
cp .env.example .env

# 3. Aplicar schema a la DB
yarn db:migrate

# 4. Dev mode (hot reload)
yarn dev
```

La API corre en `http://localhost:3000`. Todas las rutas están bajo `/api`.

## Build de producción

```bash
yarn build    # prisma generate + tsup → dist/main.js
yarn start    # node dist/main.js
```

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `DATABASE_URL` | ✅ | Connection string de PostgreSQL |
| `JWT_ACCESS_SECRET` | ✅ | Secret para access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Secret para refresh tokens |
| `TMDB_API_KEY` | ✅ | API key de TMDB |
| `PORT` | ❌ | Puerto del servidor (default: 3000) |
| `CORS_ORIGIN` | ❌ | Origen permitido (default: todos en dev) |
| `JWT_ACCESS_EXPIRES_IN` | ❌ | Expiración access token (default: 15m) |
| `JWT_REFRESH_EXPIRES_IN` | ❌ | Expiración refresh token (default: 7d) |
| `COOKIE_REFRESH_MAX_AGE` | ❌ | Max age cookie en segundos (default: 604800) |
