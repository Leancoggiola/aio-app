# Web — tooling (rules y script)

## Cursor rule

Archivo: [`.cursor/rules/web-structure.mdc`](../.cursor/rules/web-structure.mdc)

- **Cuándo aplica:** al editar archivos bajo `apps/web/**/*`
- **Qué hace:** recuerda capas, `modules/`, barrels, imports prohibidos
- **No reemplaza** esta doc ni `architecture.md`

Para editarla: cambiá el frontmatter `globs` o el cuerpo markdown.

## Script `pnpm web:new-feature`

Genera la carpeta del feature con la convención del proyecto.

### Uso

```bash
pnpm web:new-feature gym
pnpm web:new-feature expenses --path /expenses --module main
pnpm web:new-feature gym --register-route --register-nav
pnpm web:new-feature internal-tool --no-nav
```

### Flags

| Flag               | Efecto                                       |
| ------------------ | -------------------------------------------- |
| `--path /gym`      | Path de la route (default `/<name>`)         |
| `--module <name>`  | Primer sub-módulo (default `main`)           |
| `--register-route` | Agrega import + entrada en `app/routes.ts`   |
| `--register-nav`   | Muestra recordatorio para `nav-registry.tsx` |
| `--no-nav`         | No crea `*.nav.tsx`                          |

### Qué genera

- `features/<name>/` con page, routes, módulo placeholder, barrels
- Componente `<Pascal>Placeholder` y hook folder vacío

### Qué no hace

- No crea keys en `shared/api/keys.ts`
- No modifica `nav-registry` automáticamente (solo recordatorio)
- No corre tests

### Extender templates

Editá [`apps/web/scripts/new-feature.mjs`](../apps/web/scripts/new-feature.mjs).

## Relación entre piezas

| Pieza                             | Rol                             |
| --------------------------------- | ------------------------------- |
| `docs/architecture.md`            | Diseño y reglas globales        |
| `docs/web-new-feature.md`         | Checklist operativo             |
| `.cursor/rules/web-structure.mdc` | Contexto para el agente en IDE  |
| `.agents/skills/web-structure/`   | Skill para generación de código |
| `.agents/skills/swr-hooks/`       | Patrones SWR y paths            |
| `pnpm web:new-feature`            | Scaffold ejecutable             |
