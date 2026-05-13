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

## Control de acceso / Registro

- [ ] Restringir quién puede registrarse (actualmente el registro es público)
- [ ] Opciones evaluadas:
  - **Registro cerrado**: eliminar `/auth/register` público, solo admin crea cuentas
  - **Invite codes**: requiere código de invitación para registrarse
  - **Approve flow**: campo `isApproved` en User, admin aprueba antes de permitir login
  - **Whitelist de emails**: solo emails pre-aprobados pueden registrarse
- [ ] Decisión pendiente: elegir approach (para 2-3 usuarios, registro cerrado o approve flow)

## Otros pendientes

- [ ] Considerar agregar `currentPassword` al flujo de cambio de contraseña (decisión: por ahora solo `newPassword`, el JWT autentica)
- [ ] Agregar página/ruta de stats en el frontend (el endpoint `GET /api/users/stats` ya existe)

## Deployment

- [ ] **Configurar Render** — Conectar repo, usar `render.yaml` como IaC, configurar env vars (DATABASE_URL, JWT secrets, TMDB_API_KEY, CORS_ORIGIN)
- [ ] **Configurar Vercel** — Importar repo → Root: `apps/web`, Framework: Vite, Build: `cd ../.. && pnpm turbo build --filter=web`, Output: `dist`, Install: `pnpm install --frozen-lockfile`, agregar env var `VITE_API_URL`
- [ ] **UptimeRobot** — Monitor HTTP(s) a `https://<app>.onrender.com/api/health` cada 5 min (keep-alive para free tier)
