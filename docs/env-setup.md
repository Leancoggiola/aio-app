# Environment Setup

## `apps/api`

Copiar `.env.example` a `.env` y completar los valores:

```bash
cp apps/api/.env.example apps/api/.env
```

### Variables

| Variable                 | Requerida | Descripción                                                                                                            |
| ------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | ✅        | URL de Supabase con pgbouncer. Usada por la app en runtime.                                                            |
| `DIRECT_URL`             | ✅        | URL de Supabase sin pooler. Usada por la CLI de Prisma (migraciones, seed).                                            |
| `JWT_ACCESS_SECRET`      | ✅        | Secret para firmar access tokens. Generar con `openssl rand -base64 32`.                                               |
| `JWT_REFRESH_SECRET`     | ✅        | Secret para firmar refresh tokens. Generar con `openssl rand -base64 32`.                                              |
| `JWT_ACCESS_EXPIRES_IN`  | —         | Expiración del access token. Default: `15m`.                                                                           |
| `JWT_REFRESH_EXPIRES_IN` | —         | Expiración del refresh token. Default: `7d`.                                                                           |
| `COOKIE_REFRESH_MAX_AGE` | —         | Max-age de la cookie del refresh token en **segundos**. Default: `604800` (7 días).                                    |
| `PORT`                   | —         | Puerto del servidor. Default: `3000`.                                                                                  |
| `CORS_ORIGIN`            | —         | Origen permitido (ej: `http://localhost:5173`). Si no se define, permite `localhost:5173`.                             |
| `TMDB_API_KEY`           | ✅        | API key de TMDB (JWT Bearer token). Obtener en [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api). |
| `ADMIN_USERNAME`         | ✅        | Username del usuario admin inicial. Usado por `prisma db seed`.                                                        |
| `ADMIN_PASSWORD`         | ✅        | Password del usuario admin inicial. Usado por `prisma db seed`.                                                        |

### Cómo obtener las URLs de Supabase

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto
2. **Project Settings → Database → Connection string**
3. `DATABASE_URL` → usar la de **Transaction pooler** (puerto `6543`) + agregar `?pgbouncer=true`
4. `DIRECT_URL` → usar la de **Direct connection** (puerto `5432`)

---

## `apps/web`

El frontend no tiene `.env` propio en desarrollo. Vite usa el proxy configurado en `vite.config.ts` para redirigir `/api/*` al backend en `localhost:3000`.

En producción (Vercel: `omni-nest`), si el cliente llama a la API en otro origen, configurar `VITE_API_URL` (ej. `https://omni-api-gwer.onrender.com`) y asegurar `CORS_ORIGIN` en Render.

## `apps/mobile`

Copiar `apps/mobile/.env.example` → `.env` y setear `EXPO_PUBLIC_API_URL` (sin slash final), apuntando a la API local o a Render.

---

## Inicialización de la BD (primera vez)

```bash
cd apps/api

# 1. Aplicar migraciones
pnpm prisma migrate deploy

# 2. Crear usuario admin y datos de desarrollo
pnpm prisma db seed
```

Ver [prisma.md](./prisma.md) para más detalle sobre los comandos.
