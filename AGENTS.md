# AIO App — guía para agentes

Monorepo de **media tracking** (películas/series vía TMDB). Stack: Express + Prisma + PostgreSQL (Supabase), React + Vite + Mantine + SWR.

**Leé este archivo al inicio de cualquier tarea no trivial** (feature, refactor, bug transversal, cambio de contrato API↔web).

---

## Mapa del repositorio

| Ruta               | Rol                                                   |
| ------------------ | ----------------------------------------------------- |
| `apps/api/`        | REST — `auth`, `media`, `users`, `admin`              |
| `apps/web/`        | SPA — `auth`, `home`, `media`, `profile`              |
| `packages/shared/` | Zod + tipos (`@aio-app/shared`)                       |
| `docs/`            | Arquitectura y guías — índice en `docs/README.md`     |
| `.cursor/rules/`   | Leyes automáticas (web + api)                         |
| `.cursor/skills/`  | Skills del proyecto (SWR, API, shared, web-structure) |
| `.agents/skills/`  | Skills de terceros (`npx skills`: Mantine, Supabase)  |
| `.cursor/mcp.json` | MCP CodeGraph (exploración del código)                |

> `@/shared` (web) ≠ `@aio-app/shared` (paquete monorepo).

---

## Reglas de oro

1. **Un feature web no importa otro** — UI compartida → `apps/web/src/shared/ui/`.
2. **URLs HTTP solo en** `apps/web/src/shared/api/keys.ts` (`SWR_KEYS`).
3. **Contrato compartido** — schemas en `packages/shared/`; API usa `validate()`, web usa los mismos Zod en forms.
4. **Orden full-stack** — `packages/shared` → `apps/api` → `SWR_KEYS` + hooks → UI web.
5. **Referencias web** — `home` (simple), `media` (SWR + mutations), `profile` (forms).
6. **Exploración transversal** — usar **CodeGraph MCP** antes de leer muchos archivos (callers, impact, context).

---

## Cursor rules (automáticas)

| Glob          | Rules                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------ |
| `apps/web/**` | `web-structure`, `web-api-paths`, `web-swr-hooks`, `web-forms-feedback`, `web-style-props` |
| `apps/api/**` | `api-conventions`                                                                          |

Detalle: [docs/web-tooling.md](docs/web-tooling.md).

---

## Skills (pedir o usar según tarea)

| Tarea                    | Skill                                          |
| ------------------------ | ---------------------------------------------- |
| Carpetas / features web  | `web-structure`                                |
| Hooks SWR                | `swr-hooks`                                    |
| API routes / services    | `api-structure`                                |
| `packages/shared`        | `shared-contracts`                             |
| Forms Mantine            | `mantine-form`                                 |
| Combobox / select custom | `mantine-combobox`                             |
| DB Supabase              | `supabase`, `supabase-postgres-best-practices` |

---

## CodeGraph

Índice local del código (símbolos, callers, rutas). **No reemplaza** las rules ni `docs/architecture.md`.

| Cuándo                                   | Herramienta MCP                         |
| ---------------------------------------- | --------------------------------------- |
| ¿Quién llama a X? / impacto de un cambio | `codegraph_callers`, `codegraph_impact` |
| Entender un flujo (login, add media)     | `codegraph_context`                     |
| Buscar símbolo por nombre                | `codegraph_search`                      |

Setup: [docs/codegraph.md](docs/codegraph.md) · `pnpm codegraph:init` (una vez por máquina).

---

## Documentación humana

| Doc                                                                    | Uso                    |
| ---------------------------------------------------------------------- | ---------------------- |
| [docs/architecture.md](docs/architecture.md)                           | Dónde va cada archivo  |
| [docs/web-new-feature.md](docs/web-new-feature.md)                     | Nuevo feature web      |
| [docs/web-agent-prompt-template.md](docs/web-agent-prompt-template.md) | Prompts listos         |
| [docs/web-tooling.md](docs/web-tooling.md)                             | Rules, skills, scripts |

---

## Verificación antes de terminar

```bash
# Web
pnpm --filter web check-types
pnpm --filter web lint
pnpm --filter web check-api-paths
pnpm --filter web test

# API (si tocaste apps/api)
pnpm --filter api test
```

---

## Jerarquía si hay duda

1. Este `AGENTS.md` (índice y reglas de oro)
2. `.cursor/rules/` (leyes por glob)
3. `docs/architecture.md` (estructura)
4. `.cursor/skills/` y `.agents/skills/` (cómo implementar)
5. CodeGraph (cableado actual del código)
