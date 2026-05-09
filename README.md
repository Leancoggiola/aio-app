# AIO App (All-In-One)

Monorepo con Turborepo que contiene una API REST (Express + Prisma + PostgreSQL) y un frontend web (React + Vite + Mantine).

## Estructura

```
apps/
  api/          → API REST (Express, TypeScript, Prisma)
  web/          → Frontend (React, Vite, Mantine, SWR)
packages/
  shared/       → Schemas Zod, tipos y constantes compartidas
  ui/           → Componentes UI reutilizables
  eslint-config/
  typescript-config/
```

## Requisitos previos

- **Node.js** ≥ 18
- **Yarn** 1.x (`npm install -g yarn`)
- **Supabase** account (PostgreSQL hosting) — [supabase.com](https://supabase.com)

## Setup inicial

```bash
# 1. Instalar dependencias
yarn install

# 2. Copiar variables de entorno
cd apps/api
cp .env.example .env
# Editar .env con tus valores (Supabase URLs, JWT secrets, TMDB API key, etc.)

# 3. Sincronizar base de datos (crear tablas)
yarn db:migrate
# o para dev rápido sin migraciones:
yarn db:push

# 4. (Opcional) Abrir Prisma Studio para ver la DB
yarn db:studio
```

## Levantar el proyecto

```bash
# Desde la raíz — levanta API y Web en paralelo
yarn dev

# O individualmente:
yarn dev:api       # Solo API (http://localhost:3000)
cd apps/web && yarn dev   # Solo Web (http://localhost:5173)
```

## Scripts principales

| Comando       | Descripción                               |
| ------------- | ----------------------------------------- |
| `yarn dev`    | Levanta API + Web en paralelo (Turborepo) |
| `yarn build`  | Build de producción de todos los packages |
| `yarn lint`   | Lint de todo el monorepo                  |
| `yarn format` | Formateo con Prettier                     |

## Base de datos

La API usa **PostgreSQL** con **Prisma ORM**. El schema se define en `apps/api/prisma/schema.prisma`.

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

## Variables de entorno

Ver `apps/api/.env.example` para la lista completa. Valores mínimos:

```env
DATABASE_URL=postgresql://aio:aio_dev@localhost:5432/aio_app
JWT_ACCESS_SECRET=tu_secret_access
JWT_REFRESH_SECRET=tu_secret_refresh
TMDB_API_KEY=tu_api_key
```
