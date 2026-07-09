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

## URLs de producción

| Servicio     | URL                                             |
| ------------ | ----------------------------------------------- |
| API (Render) | `https://omni-api-gwer.onrender.com`            |
| Web (Vercel) | `https://omni-nest.vercel.app`                  |
| Health       | `https://omni-api-gwer.onrender.com/api/health` |

`CORS_ORIGIN` en Render debe incluir la URL de Vercel (`https://omni-nest.vercel.app`).

---

## Render

La infraestructura está declarada en [`render.yaml`](../render.yaml) (IaC).

- **Tipo:** Web Service (Docker)
- **Name / blueprint:** `omni-api` (hostname actual: `omni-api-gwer.onrender.com`)
- **Repo:** `https://github.com/Leancoggiola/omni`
- **Dockerfile:** `apps/api/Dockerfile`
- **Branch:** `main` (el servicio puede estar en `develop` hasta alinearlo)
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
./docker-entrypoint.sh
```

El script valida que `DIRECT_URL` esté configurada, aplica las migraciones pendientes con Prisma y luego inicia el servidor. Si falta `DIRECT_URL`, el contenedor falla de inmediato con un mensaje claro en lugar de colgarse esperando el pooler de Supabase.

---

## Variables de entorno en Render

Se configuran manualmente en el dashboard de Render (no se sincronizan automáticamente desde `render.yaml` por seguridad — `sync: false`):

| Variable             | Dónde obtenerla                                                          |
| -------------------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`       | Supabase → Project Settings → Database (Transaction pooler, puerto 6543) |
| `DIRECT_URL`         | Supabase → Project Settings → Database (Direct connection, puerto 5432)  |
| `JWT_ACCESS_SECRET`  | Generar: `openssl rand -base64 32`                                       |
| `JWT_REFRESH_SECRET` | Generar: `openssl rand -base64 32`                                       |
| `TMDB_API_KEY`       | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)   |
| `CORS_ORIGIN`        | URL del frontend en producción (ej. `https://omni-nest.vercel.app`)      |
| `ADMIN_USERNAME`     | A elección                                                               |
| `ADMIN_PASSWORD`     | A elección (usar password seguro)                                        |

> **Importante:** `DIRECT_URL` es obligatoria en Render. Sin ella, `prisma migrate deploy` usa el pooler (`DATABASE_URL`) y el contenedor se cuelga; Render termina el deploy por timeout de puerto.

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
