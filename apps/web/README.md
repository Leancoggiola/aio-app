# Web — AIO App

Frontend SPA para la aplicación de media tracking. Permite a los usuarios registrarse, buscar películas/series en TMDB y gestionar su lista personal.

## Stack

| Tecnología         | Uso                                       |
| ------------------ | ----------------------------------------- |
| **React 18**       | UI library                                |
| **Vite**           | Dev server + bundler (con proxy a la API) |
| **Mantine 8**      | Component library (UI + forms + hooks)    |
| **SWR**            | Data fetching, cache y revalidación       |
| **React Router 7** | Routing client-side con guards            |
| **TypeScript**     | Type safety                               |
| **SVGR**           | Importar SVGs como componentes React      |

## Estructura de carpetas

```
src/
├── main.tsx                      # Entry point — providers + RouterProvider
├── vite-env.d.ts                 # Tipos de Vite
├── app/
│   ├── router.tsx                # createBrowserRouter + Suspense wrappers
│   ├── routes.tsx                # Definición de rutas protegidas y guest
│   ├── core/
│   │   ├── auth/
│   │   │   └── AuthContext.tsx   # Estado de sesión (login, logout, register, refresh)
│   │   ├── guards/
│   │   │   ├── ProtectedRoute.tsx  # Redirige a /login si no autenticado
│   │   │   └── GuestRoute.tsx      # Redirige a / si ya autenticado
│   │   ├── hooks/                # Hooks compartidos de la app
│   │   └── layouts/
│   │       ├── RootLayout.tsx    # Layout principal (navbar, contenido)
│   │       ├── AuthLayout.tsx    # Layout para login/register
│   │       └── AnimatedBackground/  # Fondo animado para auth pages
│   ├── features/
│   │   ├── auth/                 # Login y Register pages + componentes
│   │   ├── home/                 # Home page
│   │   └── mediaTracker/         # Búsqueda TMDB, lista de media, cards
│   └── providers/
│       └── SWRProvider.tsx       # Config global de SWR (fetcher, revalidation)
├── lib/
│   ├── api.ts                    # Instancia base para HTTP requests (con interceptors)
│   └── fetcher.ts                # Fetcher para SWR (usa api.ts)
├── theme/
│   └── config.ts                 # Tema customizado de Mantine
└── assets/                       # Imágenes, íconos, etc.
```

## Arquitectura de routing

```
ProtectedRoute (requiere auth)
└── RootLayout (navbar + outlet)
    ├── /          → Home
    └── /tracker   → MediaTracker

GuestRoute (solo sin auth)
└── AuthLayout (fondo animado + outlet)
    ├── /login     → Login
    └── /register  → Register
```

Las rutas se definen en `routes.tsx` y se envuelven automáticamente con `<Suspense>` en `router.tsx`.

## Levantar

```bash
# Desde la raíz del monorepo (recomendado — levanta con la API)
yarn dev

# Solo la web
yarn dev:web      # http://localhost:5173
```

> La web necesita la API corriendo. Vite hace proxy automático de `/api` → `http://localhost:3000`.

## Build de producción

```bash
yarn build     # tsc + vite build → dist/
yarn preview   # Preview del build local
```

## Paquetes compartidos

| Paquete           | Descripción                                 |
| ----------------- | ------------------------------------------- |
| `@aio-app/shared` | Schemas Zod, tipos y constantes compartidas |
| `@repo/ui`        | Componentes UI reutilizables                |
