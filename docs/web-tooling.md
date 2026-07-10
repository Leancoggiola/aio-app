# Web — tooling (rules, skills, scripts)

**Índice agentes:** [AGENTS.md](../AGENTS.md) (aplicado vía rule `project-agents`, `alwaysApply: true`).

**Plantillas de prompt:** [web-agent-prompt-template.md](./web-agent-prompt-template.md)

## Cursor rules (`apps/web`)

Se aplican automáticamente al editar archivos bajo `apps/web/**` (salvo `alwaysApply`).

| Rule                                                              | Rol                                      |
| ----------------------------------------------------------------- | ---------------------------------------- |
| [web-structure.mdc](../.cursor/rules/web-structure.mdc)           | Capas, `features/`, imports, scaffolding |
| [web-api-paths.mdc](../.cursor/rules/web-api-paths.mdc)           | Solo `SWR_KEYS`; sin `/api/` inline      |
| [web-swr-hooks.mdc](../.cursor/rules/web-swr-hooks.mdc)           | Resumen SWR; detalle en skill            |
| [web-forms-feedback.mdc](../.cursor/rules/web-forms-feedback.mdc) | `useForm`, Alert, `notifySuccess`        |
| [web-style-props.mdc](../.cursor/rules/web-style-props.mdc)       | Dimensiones en `rem`, token `none`       |

## Cursor rules (siempre)

| Rule                                                      | Rol                                             |
| --------------------------------------------------------- | ----------------------------------------------- |
| [project-agents.mdc](../.cursor/rules/project-agents.mdc) | Seguir `AGENTS.md` + CodeGraph para exploración |

## Cursor rules (`apps/api`)

| Rule                                                        | Rol                                          |
| ----------------------------------------------------------- | -------------------------------------------- |
| [api-conventions.mdc](../.cursor/rules/api-conventions.mdc) | Features, `validate`, `@omni/shared`, router |

## Skills del proyecto (`.cursor/skills/`)

| Skill              | Cuándo usarla                              |
| ------------------ | ------------------------------------------ |
| `web-structure`    | Carpetas/features/modules en web           |
| `swr-hooks`        | Hooks bajo `features/*/hooks/`, `SWR_KEYS` |
| `api-structure`    | Rutas, services, Prisma en `apps/api`      |
| `shared-contracts` | Schemas/tipos en `packages/shared`         |

## Mantine (web)

- Paquetes `@mantine/*` en **9.4.1** (`apps/web`).
- `MantineProvider` usa `deduplicateInlineStyles` (React 19 style-tag dedupe para style props responsive; no cubre `SimpleGrid`/`Grid`).
- Defaults de inputs vía `Input.extend` en `theme/components.tsx` (cascada a TextInput, Select, DatePickerInput, etc.).
- Skills oficiales (`mantine-form`, `mantine-combobox`, `mantine-custom-components`): refrescar solo con CLI (`npx skills add mantinedev/skills --skill …` / update). No editar `.agents/skills/mantine-*` a mano.

### Backlog — React Compiler (historia de tablero)

**No activado** en Omni. Historia propuesta:

1. **Qué:** compilador de React que memoiza automáticamente en build (menos `useMemo`/`useCallback` manuales).
2. **Por qué ahora es viable:** Mantine 9.4.1 incluye fixes de `@mantine/form` y hooks compatibles con React Compiler.
3. **Scope del spike:** plugin Vite (`babel-plugin-react-compiler`), smoke de forms + Combobox TMDB + listas media, escape hatch `"use no memo"` si hace falta.
4. **Criterio de done:** build verde, sin regresiones en login/profile/AddMediaModal; documentar componentes excluidos si los hay.

Issue de tablero: [#29](https://github.com/Leancoggiola/omni/issues/29).

## Skills de terceros (`.agents/skills/`)

Instalados con `npx skills add`. No mover a `.cursor/skills/` (el CLI reinstala en `.agents/`).

| Skill                              | Cuándo usarla                   |
| ---------------------------------- | ------------------------------- |
| `mantine-form`                     | Formularios con `@mantine/form` |
| `mantine-combobox`                 | Dropdowns custom con Combobox   |
| `mantine-custom-components`        | `factory()`, Styles API         |
| `supabase`                         | Auth, CLI, integración Supabase |
| `supabase-postgres-best-practices` | SQL, índices, RLS               |

**Jerarquía:** rule = ley corta en el IDE · skill = procedimiento con ejemplos. No duplicar el mismo texto en ambos.

## Scripts

### `pnpm web:new-feature`

```bash
pnpm web:new-feature gym
pnpm web:new-feature gym --register-route --register-nav --nav-key gym --swr-domain gym
```

Ver flags en [web-new-feature.md](./web-new-feature.md).

### Otros

```bash
pnpm web:new-hook media library useMyMediaList
pnpm web:new-component profile settings ProfileCard
pnpm web:new-test src/features/.../profileForm.ts
pnpm --filter web check-api-paths
```

## Relación con mobile

Tooling paralelo: [mobile-tooling.md](./mobile-tooling.md). Contratos compartidos en `@omni/shared`.

| Prioridad | Target                                            |
| --------- | ------------------------------------------------- |
| Alta      | `shared/api/keys.ts`, `fetcher.ts`, `**/utils/**` |
| Media     | 1–2 smoke con `renderWithProviders`               |
| Baja      | Cada componente Mantine                           |

```bash
pnpm --filter web test
pnpm --filter web test:coverage
pnpm --filter web check-types
pnpm --filter web lint
```

## CodeGraph

| Comando                 | Efecto            |
| ----------------------- | ----------------- |
| `pnpm codegraph:init`   | Indexar monorepo  |
| `pnpm codegraph:status` | Estado del índice |
| `pnpm codegraph:sync`   | Re-sincronizar    |

MCP: [.cursor/mcp.json](../.cursor/mcp.json) · [codegraph.md](./codegraph.md).

## Relación entre piezas

| Pieza                     | Rol                                    |
| ------------------------- | -------------------------------------- |
| `AGENTS.md`               | Índice y reglas de oro                 |
| `docs/architecture.md`    | Mapa del monorepo                      |
| `docs/web-new-feature.md` | Checklist feature web                  |
| `.cursor/rules/`          | Convenciones automáticas               |
| `.cursor/skills/`         | Skills del proyecto                    |
| `.agents/skills/`         | Skills de terceros (Mantine, Supabase) |
| `pnpm web:new-*`          | Scaffolds                              |
