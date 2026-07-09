# Plantillas de prompt — mobile (Cursor)

## Feature nuevo

```
Implementá el feature <nombre> en apps/mobile con paridad a web si existe.
Seguí AGENTS.md, docs/mobile-tooling.md y skills mobile-structure + mobile-data-hooks.
Contratos solo en @omni/shared. Paths solo en API_KEYS. Auth Bearer + SecureStore.
```

## Bug / fix

```
En apps/mobile, arreglá <síntoma>. No toques web salvo contrato compartido.
Usá CodeGraph si el flujo cruza API. Verificá con pnpm --filter mobile check-types.
```

## Auth / API

```
Cambio de auth o endpoint: shared → api → mobile (y web si aplica).
Documentá dual cookie/Bearer en architecture si cambia el contrato.
```
