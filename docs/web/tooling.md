# Web — tooling (rules, skills, scripts)

**Índice agentes:** [AGENTS.md](../../AGENTS.md).

**Plantillas de prompt:** [agent-prompts.md](./agent-prompts.md)

## Cursor rules (`apps/web`)

Se aplican al editar bajo `apps/web/**` (salvo `alwaysApply`).

| Rule                                                                 | Rol                                      |
| -------------------------------------------------------------------- | ---------------------------------------- |
| [web-structure.mdc](../../.cursor/rules/web-structure.mdc)           | Capas, `features/`, imports, scaffolding |
| [web-api-paths.mdc](../../.cursor/rules/web-api-paths.mdc)           | Solo `SWR_KEYS`; sin `/api/` inline      |
| [web-swr-hooks.mdc](../../.cursor/rules/web-swr-hooks.mdc)           | Resumen SWR; detalle en skill            |
| [web-forms-feedback.mdc](../../.cursor/rules/web-forms-feedback.mdc) | `useForm`, Alert, `notifySuccess`        |
| [web-style-props.mdc](../../.cursor/rules/web-style-props.mdc)       | Dimensiones en `rem`, token `none`       |

También: [project-agents.mdc](../../.cursor/rules/project-agents.mdc) (`alwaysApply`).

## Skills del proyecto (`.cursor/skills/`)

| Skill              | Cuándo usarla                              |
| ------------------ | ------------------------------------------ |
| `web-structure`    | Carpetas/features/modules en web           |
| `swr-hooks`        | Hooks bajo `features/*/hooks/`, `SWR_KEYS` |
| `api-structure`    | Rutas, services, Prisma en `apps/api`      |
| `shared-contracts` | Schemas/tipos en `packages/shared`         |

## Mantine (web)

- Paquetes `@mantine/*` en **9.4.1** (`apps/web`).
- `MantineProvider` usa `deduplicateInlineStyles` (React 19; no cubre `SimpleGrid`/`Grid`).
- Defaults de inputs vía `Input.extend` en `theme/components.tsx`.
- Skills oficiales (`mantine-form`, `mantine-combobox`, `mantine-custom-components`): actualizar solo con CLI (`npx skills add mantinedev/skills …`). No editar `.agents/skills/mantine-*` a mano.
- React Compiler: **no activado**. Spike diferido: [#29](https://github.com/Leancoggiola/omni/issues/29).

## Skills de terceros (`.agents/skills/`)

Instalados con `npx skills add`. No mover a `.cursor/skills/` (el CLI reinstala en `.agents/`).

| Skill                              | Cuándo usarla                   |
| ---------------------------------- | ------------------------------- |
| `mantine-form`                     | Formularios con `@mantine/form` |
| `mantine-combobox`                 | Dropdowns custom con Combobox   |
| `mantine-custom-components`        | `factory()`, Styles API         |
| `supabase`                         | Auth, CLI, integración Supabase |
| `supabase-postgres-best-practices` | SQL, índices, RLS               |

**Jerarquía:** rule = ley corta en el IDE · skill = procedimiento con ejemplos.

## Scripts

```bash
pnpm web:new-feature gym
pnpm web:new-feature gym --register-route --register-nav --nav-key gym --swr-domain gym
pnpm web:new-hook media library useMyMediaList
pnpm web:new-component profile settings ProfileCard
pnpm web:new-test src/features/.../profileForm.ts
pnpm --filter web check-api-paths
```

Flags y checklist: [new-feature.md](./new-feature.md).

## Verificación

```bash
pnpm --filter web check-types
pnpm --filter web lint
pnpm --filter web check-api-paths
pnpm --filter web test
```

Prioridad de tests: alta en `shared/api` y utils; media 1–2 smokes con `renderWithProviders`; baja por cada componente Mantine.

## Relación con mobile

Tooling paralelo: [mobile/tooling.md](../mobile/tooling.md). Contratos en `@omni/shared`.

CodeGraph: [codegraph.md](../tooling/codegraph.md).
