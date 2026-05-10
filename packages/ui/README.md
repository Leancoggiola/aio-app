# @repo/ui

Componentes UI reutilizables para el monorepo AIO App, construidos con **Mantine 8** y **React 18**.

Es un **Just-in-Time Package** — exporta TypeScript directo sin paso de build.

## Exports

| Path               | Componente                         |
| ------------------ | ---------------------------------- |
| `@repo/ui`         | Re-export de todos los componentes |
| `@repo/ui/counter` | Componente Counter                 |
| `@repo/ui/header`  | Componente Header                  |

## Uso

```typescript
import { Counter, Header } from "@repo/ui";
```

## Scripts

```bash
yarn workspace @repo/ui lint   # Linting
```
