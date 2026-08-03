# Notificaciones lifestyle — Omni API

Arquitectura para push/email (fase 2) e integración Raspberry Pi.

## MVP (implementado)

| Endpoint                                | Auth                     | Descripción                      |
| --------------------------------------- | ------------------------ | -------------------------------- |
| `GET /api/notifications/digest`         | JWT o `Bearer omni_pi_…` | Resumen gastos + alacena + split |
| `GET /api/notifications/devices`        | JWT                      | Listar dispositivos del usuario  |
| `POST /api/notifications/devices`       | JWT                      | Registrar dispositivo            |
| `DELETE /api/notifications/devices/:id` | JWT                      | Revocar dispositivo              |

Opt-in global: `UserPreferences.notifications`.

## Digest

Incluye:

- **Gastos:** recordatorios vencidos y del día
- **Alacena:** stock bajo y por vencer (7 días)
- **Split:** juntadas pendientes con deudas

## Raspberry Pi

1. En web/perfil, activar notificaciones.
2. `POST /api/notifications/devices` `{ "platform": "RASPBERRY_PI", "label": "Pi cocina" }` → respuesta incluye `apiKey` (una sola vez).
3. Agente en Pi:

```bash
curl -H "Authorization: Bearer omni_pi_…" https://api.example.com/api/notifications/digest
```

Ver plan en `.cursor/plans/` y `tools/omni-pi-agent/` (fase 2).

## Web Push (fase 2)

Env vars:

```bash
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VITE_VAPID_PUBLIC_KEY=
```

Service Worker + `POST /notifications/devices` con `platform: WEB`.

## Mobile Expo (fase 2)

`expo-notifications` → token → `platform: MOBILE`.

## Email (fase 2)

Cron + Resend/SendGrid usando el mismo digest por usuario.
