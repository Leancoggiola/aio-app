---
name: web-structure
description: Folder structure and import conventions for apps/web (feature-based architecture with modules). Use when creating or moving files under apps/web/src/features, apps/web/src/shared, apps/web/src/core, or apps/web/src/layouts. Triggers on new feature, modules/, shared/ui, nav-registry, or web:new-feature scaffold.
---

# Web structure — omni

## Layers

| Path                            | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `apps/web/src/app/`             | `router.tsx`, `routes.ts`, `navigation/nav-registry.tsx` |
| `apps/web/src/features/<name>/` | Product domain                                           |
| `apps/web/src/shared/api/`      | HTTP client, fetcher, `SWR_KEYS`                         |
| `apps/web/src/shared/ui/`       | Cross-feature UI                                         |
| `apps/web/src/core/`            | `auth`, `guards`, `providers`                            |
| `apps/web/src/layouts/`         | App shell                                                |

## Feature template

```
features/<name>/
  <name>.routes.tsx
  <name>.page.tsx
  <name>.nav.tsx       # optional
  index.ts
  modules/<module>/
    components/<Component>/<Component>.tsx
    components/<Component>/index.ts
    hooks/useX/useX.ts
    hooks/useX/index.ts
  modules/_shared/
```

## Rules

- **Never** `features/A` importing `features/B`
- Cross-feature UI → `shared/ui/`
- `@/shared/api` for SWR (not `@/common/api`)
- Navbar: colocated `*.nav.tsx` + `app/navigation/nav-registry.tsx`
- Scaffold: `pnpm web:new-feature <name>`

## Docs

- `docs/web-new-feature.md` — checklist
- `docs/web-tooling.md` — rule + script
