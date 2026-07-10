# Mobile — tooling (rules, skills)

**Índice agentes:** [AGENTS.md](../../AGENTS.md).

**Plantillas:** [agent-prompts.md](./agent-prompts.md)

## Cursor rules (`apps/mobile`)

| Rule                                                             | Rol                      |
| ---------------------------------------------------------------- | ------------------------ |
| [mobile-structure.mdc](../../.cursor/rules/mobile-structure.mdc) | Capas, features, Tamagui |
| [mobile-api-paths.mdc](../../.cursor/rules/mobile-api-paths.mdc) | Solo `API_KEYS`          |
| [mobile-auth.mdc](../../.cursor/rules/mobile-auth.mdc)           | Bearer + SecureStore     |

## Skills del proyecto

| Skill               | Cuándo                                |
| ------------------- | ------------------------------------- |
| `mobile-structure`  | Carpetas / features mobile            |
| `mobile-data-hooks` | Hooks SWR + Bearer                    |
| `shared-contracts`  | Schemas `@omni/shared` (web + mobile) |
| `api-structure`     | Cambios en API                        |

## Scripts

```bash
pnpm dev:mobile
pnpm --filter mobile check-types
pnpm --filter mobile lint
pnpm --filter mobile prebuild
```

Env: `apps/mobile/.env` ← `EXPO_PUBLIC_API_URL` (ver [apps/mobile/README.md](../../apps/mobile/README.md)).

## Relación con web

| Tema      | Web            | Mobile               |
| --------- | -------------- | -------------------- |
| UI        | Mantine        | Tamagui              |
| Auth      | Cookies        | Bearer + SecureStore |
| Paths     | `SWR_KEYS`     | `API_KEYS`           |
| Contratos | `@omni/shared` | `@omni/shared`       |

Nuevo feature: [new-feature.md](./new-feature.md). Web: [web/tooling.md](../web/tooling.md).
