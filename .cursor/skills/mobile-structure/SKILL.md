---
name: mobile-structure
description: Folder structure for apps/mobile (Expo Router, features, Tamagui). Use when creating or moving files under apps/mobile.
---

# Mobile structure — Omni

## Layout

```
apps/mobile/
  app/                    # Expo Router
    _layout.tsx           # Tamagui + AuthProvider + AuthGate
    login.tsx
    (tabs)/index|media|profile.tsx
  src/
    core/auth/
    shared/api/           # API_KEYS, client, tokenStorage
    features/<name>/
    theme/tamagui.config.ts
```

## Nuevo feature

1. `src/features/<name>/` con screen + hooks
2. Ruta en `app/` (tab o stack)
3. Keys en `API_KEYS` si hay HTTP
4. Schemas en `@omni/shared` si el contrato es nuevo

## Docs

`docs/mobile-tooling.md` · `docs/mobile-new-feature.md`
