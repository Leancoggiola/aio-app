# Web

Frontend construido con **React**, **Vite**, **Mantine** y **SWR**.

## Stack

- **React 18** — UI library
- **Vite** — Dev server y bundler
- **Mantine 8** — Component library (UI + forms + hooks)
- **SWR** — Data fetching y cache
- **React Router 7** — Routing (client-side)
- **TypeScript**

## Estructura de carpetas

```
apps/web/src/
├── main.tsx                  # Entry point (monta App con providers)
├── app/
│   ├── router.tsx            # Configuración del router
│   ├── routes.tsx            # Definición de rutas
│   ├── core/
│   │   ├── auth/             # AuthContext (estado de sesión)
│   │   ├── guards/           # ProtectedRoute, GuestRoute
│   │   ├── hooks/            # Hooks compartidos
│   │   └── layouts/          # AuthLayout, MainLayout
│   ├── features/
│   │   ├── auth/             # Login, Register pages
│   │   ├── home/             # Home page
│   │   └── mediaTracker/     # Media tracker (search, list, cards)
│   └── providers/
│       └── SWRProvider.tsx   # Configuración global de SWR
├── lib/
│   ├── api.ts                # Instancia base para llamadas HTTP
│   └── fetcher.ts            # Fetcher para SWR
├── theme/
│   └── config.ts             # Tema de Mantine
└── assets/
```

## Levantar

```bash
# Desde la raíz del monorepo
yarn dev          # Levanta web + api en paralelo

# O solo la web
cd apps/web
yarn dev          # http://localhost:5173
```

> La web necesita la API corriendo para funcionar. Asegurate de tener la API levantada en `http://localhost:3000`.

## Build de producción

```bash
yarn build     # tsc + vite build → dist/
yarn preview   # Preview del build local
```

## Paquetes compartidos

- **`@aio-app/shared`** — Schemas Zod, tipos y constantes compartidas entre API y Web
- **`@repo/ui`** — Componentes UI reutilizables
