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

## Build Issue (pre-existente)

- [ ] Error de esbuild/passport en `yarn build` de la API — no afecta `tsc --noEmit` ni el runtime, solo el bundling con tsup
- [ ] Investigar resolución de módulos de passport con esbuild

## Otros pendientes

- [ ] Considerar agregar `currentPassword` al flujo de cambio de contraseña (decisión: por ahora solo `newPassword`, el JWT autentica)
- [ ] Agregar página/ruta de stats en el frontend (el endpoint `GET /api/users/stats` ya existe)
