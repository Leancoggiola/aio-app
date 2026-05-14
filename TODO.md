# Próximos cambios pendientes

Decisiones tomadas en la sesión de refactorización (2026-05-10), diferidas para implementación futura.

## Avatar Upload

- [ ] Endpoint `POST /api/users/avatar` — upload de imagen
- [ ] Validación de tipo de archivo (jpg, png, webp) y tamaño máximo
- [ ] Resize/optimización de imagen
- [ ] Integración con **Supabase Storage** (decisión tomada)
- [ ] Almacenar URL resultante en `User.avatarUrl` (campo ya existe en schema)
- [ ] Endpoint `DELETE /api/users/avatar`
- [ ] Componente frontend para subir/previsualizar avatar en ProfilePage

## Notificaciones

- [ ] El campo `UserPreferences.notifications` es solo un flag/placeholder
- [ ] Definir qué tipo de notificaciones soportar (email, push, in-app)
- [ ] Implementar backend de notificaciones cuando se defina el alcance

## ~~Build Issue (pre-existente)~~ ✅ RESUELTO

- [x] ~~Error de esbuild/passport en `yarn build` de la API~~ — Faltaban `passport` y `passport-jwt` en `dependencies` del `package.json` de la API. Agregados con `yarn add passport passport-jwt`.

## ~~Control de acceso / Registro~~ ✅ IMPLEMENTADO

- [x] Registro cerrado: solo admin crea cuentas via `POST /api/admin/users`
- [x] Roles: enum `ADMIN`/`USER` en Prisma, incluido en JWT
- [x] Login por username/password (email opcional)
- [x] Admin guard middleware (`requireAdmin`)
- [x] Seed script para primer admin (`ADMIN_USERNAME` + `ADMIN_PASSWORD` env vars)
- [x] Frontend: página Register eliminada, login usa username

## Otros pendientes

- [ ] Considerar agregar `currentPassword` al flujo de cambio de contraseña (decisión: por ahora solo `newPassword`, el JWT autentica)
- [ ] Agregar página/ruta de stats en el frontend (el endpoint `GET /api/users/stats` ya existe)
- [ ] Agregar página de admin en frontend para gestionar usuarios (actualmente solo vía API)

## Deployment

- [x] **render.yaml** — IaC con env vars (DATABASE_URL, JWT secrets, TMDB_API_KEY, CORS_ORIGIN, ADMIN_USERNAME, ADMIN_PASSWORD)
- [x] **Dockerfile** — CMD ejecuta `prisma migrate deploy` antes de iniciar el server
- [ ] **Configurar Render** — Conectar repo, Render detecta `render.yaml`. Configurar env vars en dashboard:
  - `DATABASE_URL`: connection string de Supabase (usar DIRECT_URL, port 5432, sin pgbouncer)
  - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: generar con `openssl rand -base64 32`
  - `TMDB_API_KEY`: API key de TMDB
  - `CORS_ORIGIN`: URL de Vercel (ej: `https://aio-app.vercel.app`)
  - `ADMIN_USERNAME` / `ADMIN_PASSWORD`: credenciales del primer admin
- [ ] **Configurar Vercel** — Importar repo → Root: `apps/web`, Framework: Vite, Build: `cd ../.. && pnpm turbo build --filter=web`, Output: `dist`, Install: `pnpm install --frozen-lockfile`, agregar env var `VITE_API_URL`
- [ ] **UptimeRobot** — Monitor HTTP(s) a `https://<app>.onrender.com/api/health` cada 5 min (keep-alive para free tier)

## Observability

- [ ] **Sentry** (free tier) — Error tracking para API y Web. Source maps upload en build step.
