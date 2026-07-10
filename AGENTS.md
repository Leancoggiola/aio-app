# Omni — guía para agentes

Monorepo de **media tracking** (películas/series vía TMDB). Clientes: **web** (React + Vite + Mantine + SWR) y **mobile** (Expo + Tamagui + SWR). API: Express + Prisma + PostgreSQL (Supabase).

**Leé este archivo al inicio de cualquier tarea no trivial** (feature, refactor, bug transversal, cambio de contrato API↔clientes).

---

## Mapa del repositorio

| Ruta               | Rol                                                    |
| ------------------ | ------------------------------------------------------ |
| `apps/api/`        | REST — `auth`, `media`, `users`, `admin`               |
| `apps/web/`        | SPA — `auth`, `home`, `media`, `profile`               |
| `apps/mobile/`     | Expo Android — paridad con web                         |
| `packages/shared/` | Zod + tipos (`@omni/shared`)                           |
| `docs/`            | Índice en `docs/README.md`                             |
| `.cursor/rules/`   | Laws por glob (`web-*`, `mobile-*`, `api-conventions`) |
| `.cursor/skills/`  | Skills proyecto (web, mobile, api, shared)             |
| `.agents/skills/`  | Skills terceros (Mantine, Supabase)                    |
| `.cursor/mcp.json` | MCP CodeGraph                                          |

> `@/shared` (alias del cliente) ≠ `@omni/shared` (paquete monorepo).

---

## Reglas de oro

1. **Un feature no importa otro** del mismo cliente — UI compartida en `shared/ui` (web) o componentes locales (mobile).
2. **URLs HTTP centralizadas** — web: `SWR_KEYS`; mobile: `API_KEYS`. Nunca literales `/api/` en features.
3. **Contrato compartido** — `packages/shared`; API `validate()`; clientes mismos Zod/tipos.
4. **Orden full-stack** — `shared` → `api` → hooks + UI del cliente (web y/o mobile).
5. **Auth** — web: cookies; mobile: Bearer + SecureStore. Mismos endpoints; login/refresh también devuelven tokens en el body.
6. **Referencias** — web: `home` / `media` / `profile`; mobile: mismas features bajo `apps/mobile/src/features/`.
7. **Exploración transversal** — CodeGraph MCP antes de leer muchos archivos.

---

## Cursor rules (automáticas)

| Glob             | Rules                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `apps/web/**`    | `web-structure`, `web-api-paths`, `web-swr-hooks`, `web-forms-feedback`, `web-style-props` |
| `apps/mobile/**` | `mobile-structure`, `mobile-api-paths`, `mobile-auth`                                      |
| `apps/api/**`    | `api-conventions`                                                                          |

Detalle: [docs/web-tooling.md](docs/web-tooling.md) · [docs/mobile-tooling.md](docs/mobile-tooling.md).

---

## Skills

| Tarea            | Skill                                          |
| ---------------- | ---------------------------------------------- |
| Features web     | `web-structure`                                |
| Hooks SWR web    | `swr-hooks`                                    |
| Features mobile  | `mobile-structure`                             |
| Hooks SWR mobile | `mobile-data-hooks`                            |
| API              | `api-structure`                                |
| Shared           | `shared-contracts`                             |
| Forms Mantine    | `mantine-form`                                 |
| Supabase         | `supabase`, `supabase-postgres-best-practices` |

Web usa **Mantine 9.4.1** con `deduplicateInlineStyles`. Skills `mantinedev/skills` se actualizan con CLI, no a mano. React Compiler: backlog documentado en [docs/web-tooling.md](docs/web-tooling.md) (no activar sin spike).

---

## CodeGraph

| Cuándo            | Tool                                    |
| ----------------- | --------------------------------------- |
| Callers / impacto | `codegraph_callers`, `codegraph_impact` |
| Flujo             | `codegraph_context`                     |
| Buscar símbolo    | `codegraph_search`                      |

Setup: [docs/codegraph.md](docs/codegraph.md).

---

## Documentación

| Doc                                                                                                      | Uso                    |
| -------------------------------------------------------------------------------------------------------- | ---------------------- |
| [docs/architecture.md](docs/architecture.md)                                                             | Estructura + auth dual |
| [docs/web-tooling.md](docs/web-tooling.md) / [mobile-tooling.md](docs/mobile-tooling.md)                 | Rules/skills           |
| [docs/web-new-feature.md](docs/web-new-feature.md) / [mobile-new-feature.md](docs/mobile-new-feature.md) | Checklists             |
| [docs/rename-omni-externals.md](docs/rename-omni-externals.md)                                           | Rename externos        |

---

## Verificación

```bash
pnpm --filter web check-types && pnpm --filter web lint && pnpm --filter web check-api-paths && pnpm --filter web test
pnpm --filter mobile check-types && pnpm --filter mobile lint
pnpm --filter api test   # si tocaste API
```

---

## Jerarquía

1. Este `AGENTS.md`
2. `.cursor/rules/`
3. `docs/architecture.md`
4. `.cursor/skills/` / `.agents/skills/`
5. CodeGraph
