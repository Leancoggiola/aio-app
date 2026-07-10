# Rename externos: aio-app → Omni

Checklist **completado** (2026-07-09). Se deja como referencia histórica.

**Nombres finales**

| Recurso               | Valor                                                          |
| --------------------- | -------------------------------------------------------------- |
| Repo GitHub           | `Leancoggiola/omni`                                            |
| Root npm              | `omni`                                                         |
| Scopes                | `@omni/*`                                                      |
| Render                | servicio `omni-api` · URL `https://omni-api-gwer.onrender.com` |
| Web (Vercel)          | `https://omni-nest.vercel.app`                                 |
| Docker DB local       | `omni_dev`                                                     |
| Supabase display name | opcional (`aio-app-db` → Omni); connection strings sin cambio  |

**Hecho**

1. Código / scopes / `render.yaml` en el repo
2. Rename repo GitHub + remote local
3. Carpeta local `omni`
4. Render recreado (slug `omni-api-gwer`) + `RENDER_DEPLOY_HOOK_PROD` + `CORS_ORIGIN`
5. Vercel proyecto nuevo `omni-nest` (el slug `omni-web` estaba tomado globalmente)
6. Supabase: sin migración de datos; rename display name opcional
7. Secrets/CI verificados; health API OK

**Notas**

- `omni-web.vercel.app` pertenece a otro proyecto ajeno → usar `omni-nest`.
- El slug Render no se puede renombrar in-place; recrear servicio si hace falta otro hostname.
- Homepage del repo: `https://omni-nest.vercel.app`.
