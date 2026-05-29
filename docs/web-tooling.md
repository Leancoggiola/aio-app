# Web — tooling (rules y scripts)

## Cursor rules

| Archivo                                                                           | Rol                                             |
| --------------------------------------------------------------------------------- | ----------------------------------------------- |
| [`.cursor/rules/web-structure.mdc`](../.cursor/rules/web-structure.mdc)           | Capas, modules, barrels, features de referencia |
| [`.cursor/rules/web-api-paths.mdc`](../.cursor/rules/web-api-paths.mdc)           | Solo `SWR_KEYS`, sin `/api/` inline             |
| [`.cursor/rules/web-swr-hooks.mdc`](../.cursor/rules/web-swr-hooks.mdc)           | Patrones SWR y ubicación de hooks               |
| [`.cursor/rules/web-forms-feedback.mdc`](../.cursor/rules/web-forms-feedback.mdc) | Forms Mantine, Alert vs notifications           |

## Script `pnpm web:new-feature`

Genera la carpeta del feature con la convención del proyecto.

### Uso

```bash
pnpm web:new-feature gym
pnpm web:new-feature expenses --path /expenses --module main
pnpm web:new-feature gym --register-route --register-nav --nav-key gym --swr-domain gym
pnpm web:new-feature internal-tool --no-nav
```

### Flags

| Flag               | Efecto                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| `--path /gym`      | Path de la route (default `/<name>`)                                   |
| `--module <name>`  | Primer sub-módulo (default `main`)                                     |
| `--register-route` | Agrega import + entrada en `app/routes.ts`                             |
| `--register-nav`   | Actualiza `app/navigation/nav-registry.tsx`                            |
| `--nav-key gym`    | Clave en `MAIN_NAV_ORDER` / `NAV_BY_KEY` (default: nombre del feature) |
| `--swr-domain gym` | Stub comentado en `shared/api/keys.ts`                                 |
| `--no-nav`         | No crea `*.nav.tsx`                                                    |

### Qué genera

- `features/<name>/` con page, routes, módulo placeholder, barrels
- Componente `<Pascal>Placeholder` y carpeta hooks vacía

## Script `pnpm web:new-hook`

```bash
pnpm web:new-hook media library useMyMediaList
```

Genera `features/<feature>/modules/<module>/hooks/useX/useX.ts` + barrels.

## Script `pnpm web:new-component`

```bash
pnpm web:new-component profile settings ProfileCard
```

Genera `components/<Name>/<Name>.tsx` + barrels.

## Script `pnpm web:new-test`

```bash
pnpm web:new-test src/features/profile/modules/_shared/utils/profileForm/profileForm.ts
```

Genera `__tests__/<name>.test.ts` colindante al source.

## Script `pnpm --filter web check-api-paths`

Falla si hay literales `/api/` fuera de `shared/api/keys.ts`. Corre en CI.

## Testing

### Qué testear (eficiente)

| Prioridad | Target                             | Por qué                                  |
| --------- | ---------------------------------- | ---------------------------------------- |
| Alta      | `shared/api/keys.ts`, `fetcher.ts` | Lógica pura, contrato API                |
| Alta      | `**/utils/**/*.ts`                 | Diff builders, helpers de dominio        |
| Media     | 1–2 smoke tests de página          | Patrón `renderWithProviders`             |
| Baja      | Cada componente Mantine            | Bajo ROI; evitar salvo regresión crítica |

### Helpers

- `src/__tests__/helpers/renderWithProviders.tsx` — MantineProvider (+ SWR opcional)
- `src/__tests__/helpers/mockAuth.ts` — factory para `useAuth`

### Coverage

Threshold **80%** en scope acotado (utils + `shared/api`), no en pages/layouts. Ver `apps/web/vitest.config.ts`.

### Verificar

```bash
pnpm --filter web test
pnpm --filter web test:coverage
pnpm --filter web check-api-paths
pnpm --filter web check-types
pnpm --filter web lint
```

## Relación entre piezas

| Pieza                           | Rol                             |
| ------------------------------- | ------------------------------- |
| `docs/architecture.md`          | Diseño y reglas globales        |
| `docs/web-new-feature.md`       | Checklist operativo             |
| `.agents/skills/web-structure/` | Skill para generación de código |
| `.agents/skills/swr-hooks/`     | Patrones SWR y paths            |
| `pnpm web:new-*`                | Scaffolds ejecutables           |
