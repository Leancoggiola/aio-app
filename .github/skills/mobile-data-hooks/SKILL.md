---
name: mobile-data-hooks
description: SWR and API hooks for apps/mobile with Bearer auth. Use when creating hooks under apps/mobile/src/features.
---

# Mobile data hooks

## Imports

```ts
import { api, API_KEYS, buildQueryString, fetcher } from '@/shared/api';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
```

## Patrones

| Caso            | Hook                                                |
| --------------- | --------------------------------------------------- |
| Sesión / perfil | `useSWRImmutable` + key null si no hay token        |
| Listas / search | `useSWR`                                            |
| Mutations       | `api.post/patch/delete` + `mutate` / `globalMutate` |

Auth refresh lo maneja el client (`401` → refresh). No reimplementar en cada hook.

Return shape: dominio + `isLoading` + `error` (+ `isMutating` si aplica).

Paridad web: skill `swr-hooks` (cookies); acá Bearer + `EXPO_PUBLIC_API_URL`.
