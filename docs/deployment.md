# Deployment

La API se deployea en **Render** como un servicio Docker. El proceso es **automático** al mergear a `main`.

---

## Flujo completo

```
push/merge a main
    │
    ├── CI (ci.yml) → lint, type-check, tests
    │
    └── Release (release.yml)
            │
            ├── semantic-release analiza commits
            ├── Si hay nueva versión:
            │     ├── Actualiza CHANGELOG.md y package.json
            │     ├── Crea tag vX.Y.Z y GitHub Release
            │     └── Dispara deploy hook de Render → build y deploy
            └── Si no hay nueva versión → no se deployea
```

> Solo commits con `feat`, `fix` o `perf` (o `BREAKING CHANGE`) generan una nueva versión y disparan el deploy.

---

## Render

La infraestructura está declarada en [`render.yaml`](../render.yaml) (IaC).

- **Tipo:** Web Service (Docker)
- **Dockerfile:** `apps/api/Dockerfile`
- **Branch:** `main`
- **Health check:** `GET /api/health`
- **Plan:** Free

### Stages del Dockerfile

| Stage       | Qué hace                                                                      |
| ----------- | ----------------------------------------------------------------------------- |
| `base`      | Node 22 Alpine + pnpm                                                         |
| `pruner`    | Turbo prune — extrae solo los archivos del workspace `api`                    |
| `installer` | Instala dependencias del monorepo podado                                      |
| `builder`   | Build de la app + `pnpm deploy --prod` para aislar dependencias de producción |
| `runner`    | Imagen final mínima con un usuario sin privilegios                            |

### Comando de inicio

```sh
npx prisma migrate deploy && node dist/main.js
```

Al arrancar el contenedor, primero aplica las migraciones pendientes y luego inicia el servidor.

---

## Variables de entorno en Render

Se configuran manualmente en el dashboard de Render (no se sincronizan automáticamente desde `render.yaml` por seguridad — `sync: false`):

| Variable             | Dónde obtenerla                                                        |
| -------------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL`       | Supabase → Project Settings → Database (Transaction pooler)            |
| `JWT_ACCESS_SECRET`  | Generar: `openssl rand -base64 32`                                     |
| `JWT_REFRESH_SECRET` | Generar: `openssl rand -base64 32`                                     |
| `TMDB_API_KEY`       | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |
| `CORS_ORIGIN`        | URL del frontend en producción                                         |
| `ADMIN_USERNAME`     | A elección                                                             |
| `ADMIN_PASSWORD`     | A elección (usar password seguro)                                      |

> `DIRECT_URL` no es necesaria en producción porque el contenedor solo corre `migrate deploy` (que puede usar la URL directa), pero actualmente `DATABASE_URL` apunta al pooler. Si hay problemas con migraciones en producción, agregar `DIRECT_URL` con la conexión directa de Supabase.

---

## Secrets requeridos en GitHub

| Secret                    | Descripción                                                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `RELEASE_TOKEN`           | GitHub Personal Access Token con permisos `repo` y `write:packages`. Necesario para que semantic-release pueda pushear tags y crear releases. |
| `RENDER_DEPLOY_HOOK_PROD` | URL del deploy hook de Render (Settings → Deploy Hooks).                                                                                      |

---

## Deploy manual

Si necesitas forzar un deploy sin crear un release:

1. Ir a Render Dashboard → tu servicio → **Manual Deploy**

O via CLI de Render:

```bash
curl -s "$RENDER_DEPLOY_HOOK_PROD"
```
