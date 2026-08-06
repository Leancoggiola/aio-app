---
name: swr-hooks
description: Patterns for creating and refactoring SWR hooks in this project (omni). Use automatically when creating, modifying, or reviewing any hook under apps/web/src/features/*/modules/*/hooks/ or apps/web/src/core/auth/. Triggers on useSWR, useSWRImmutable, useSWRMutation, SWR_KEYS, buildQueryString, useProfile, useAuth, useMyMediaList, useMediaMutations, useMediaSearch, or any new API data-fetching hook. When a new pattern is established that is not covered here, update this skill before finishing the task.
---

# SWR Hooks — Project Patterns

> **Living document**: when a new hook pattern is established that is not covered here, update this skill as part of the same task before marking it complete.

## Imports and keys

All SWR keys live in `apps/web/src/shared/api/keys.ts`, exported via `@/shared/api`.
Never hardcode URL strings in hooks.

```ts
import { api, SWR_KEYS, buildQueryString } from '@/shared/api';
```

`buildQueryString` sorts params alphabetically — always use it for dynamic query strings to guarantee consistent cache keys.

---

## Decision tree

```
New hook needed?
├── Read-only, data rarely/never changes server-side (auth session, user profile page)?
│   └── useSWRImmutable  ← no revalidation on focus/reconnect
│
├── Read — client-owned collection, filter in UI (media library)?
│   └── useSWRImmutable on bare list key + client filter
│       └── Writes → useSWRConfig mutate with optimisticData, revalidate: false
│
├── Read-only, data changes server-side (search results, shared feeds)?
│   └── useSWR  ← default revalidation behavior
│
└── Write operation (PATCH, POST, DELETE)?
    ├── Same key as read + response is the new value → useSWRMutation (populateCache, revalidate: false)
    ├── Optimistic update of a list cache → useSWRConfig mutate + optimisticData
    └── Invalidate multiple keys → useSWRConfig mutate with startsWith filter
```

---

## Patterns

### Read-only — static data (`useSWRImmutable`)

```ts
import useSWRImmutable from 'swr/immutable';
import { SWR_KEYS } from '@/shared/api';

export function useProfile() {
  const { data, isLoading, error } = useSWRImmutable<{ user: UserProfile }>(SWR_KEYS.users.profile);
  return { profile: data?.user ?? null, isLoading, error };
}
```

### Read-only — dynamic data (`useSWR`)

```ts
import useSWR from 'swr';
import { buildQueryString, SWR_KEYS } from '@/shared/api';

export function useMediaSearch(query: string) {
  const key = query ? `${SWR_KEYS.media.search}${buildQueryString({ q: query })}` : null;
  return useSWR<TmdbSearchResponse>(key);
}
```

### Read — client-owned list (`useSWRImmutable` + filter)

When the user owns the data and filters are cheap client-side (personal media list, etc.), fetch **once** without query params and filter in the hook. Avoids a network call per tab/filter and keeps a single cache key for optimistic writes.

```ts
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { SWR_KEYS } from '@/shared/api';

export function useMyMediaList(filters: MediaFilters = {}) {
  const { data, isLoading, error } = useSWRImmutable<MediaItem[]>(SWR_KEYS.media.list);

  const filtered = useMemo(() => {
    if (!data) return data;
    return data.filter(item => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.mediaType && item.mediaType !== filters.mediaType) return false;
      return true;
    });
  }, [data, filters.mediaType, filters.status]);

  return { data: filtered, allItems: data, isLoading, error };
}
```

> Expose `allItems` when UI needs the unfiltered set (e.g. “already in list” checks) while the grid shows `data`.

### Write — single key update (`useSWRMutation`)

```ts
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import { api, SWR_KEYS } from '@/shared/api';

export function useProfile() {
  const { data, isLoading, error } = useSWRImmutable<{ user: UserProfile }>(SWR_KEYS.users.profile);

  const { trigger: updateProfile, isMutating } = useSWRMutation(
    SWR_KEYS.users.profile,
    (_url: string, { arg }: { arg: UpdateProfilePayload }) =>
      api.patch<{ user: UserProfile }>(SWR_KEYS.users.profile, arg),
    { populateCache: true, revalidate: false }
  );

  return { profile: data?.user ?? null, isLoading, isMutating, error, updateProfile };
}
```

> `populateCache: true` writes the mutation response directly into the read cache (same key).
> `revalidate: false` skips the redundant GET — we already have the fresh data.

### Write — optimistic list update (`useSWRConfig`)

Prefer this for client-owned lists (single cache key). Update the cache immediately; skip revalidation so the UI does not flash.

```ts
import { useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { api, SWR_KEYS } from '@/shared/api';

export function useMediaMutations() {
  const { mutate } = useSWRConfig();
  const listKey = SWR_KEYS.media.list;

  const updateStatus = useCallback(
    async (itemId: string, status: MediaStatus) => {
      let updated: MediaItem | undefined;

      await mutate(
        listKey,
        async (current: MediaItem[] | undefined) => {
          updated = await api.patch<MediaItem>(SWR_KEYS.media.listItem(itemId), { status });
          return current?.map(item => (item.id === itemId ? updated! : item)) ?? [updated!];
        },
        {
          optimisticData: (current: MediaItem[] | undefined) =>
            current?.map(item => (item.id === itemId ? { ...item, status } : item)) ?? [],
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      return updated!;
    },
    [mutate, listKey]
  );
}
```

### Write — invalidate multiple keys (`useSWRConfig`)

Use only when a write must bust several distinct cache keys (not the preferred path for media list):

```ts
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/shared/api';

const { mutate } = useSWRConfig();

mutate((key: unknown) => typeof key === 'string' && key.startsWith(SWR_KEYS.media.list), undefined, {
  revalidate: true,
});
```

### Auth — login / logout

Auth cache uses bound mutate from `useSWRImmutable` inside `AuthContext`:

- **login**: `await mutate(apiResponse, { revalidate: false })` — populate with server response
- **logout**: `await mutate(undefined, { revalidate: false })` — clear cache without hitting the API again

### Auth vs profile — two caches, two shapes

| Hook / context | SWR key                  | Type                                     | When it loads            |
| -------------- | ------------------------ | ---------------------------------------- | ------------------------ |
| `useAuth`      | `SWR_KEYS.auth.profile`  | `SessionUser` (no `id`)                  | App shell, guards, login |
| `useProfile`   | `SWR_KEYS.users.profile` | `UserProfile` (with `id`, `preferences`) | Profile page only        |

- Do **not** call `useProfile` in layout/shell — use `useAuth` for `name`, `email`, `avatarUrl`.
- After `updateProfile`, sync auth cache with `toSessionUser(profile)` via `useSWRConfig().mutate(SWR_KEYS.auth.profile, …)`.
- `updatePreferences` patches `SWR_KEYS.users.preferences` and merges into the profile cache. There is no `GET /api/users/preferences` — preferences come from `GET /api/users/profile`.

---

## Where to place hooks

```
apps/web/src/
├── core/
│   └── auth/                    ← useAuth (AuthContext), auth-related hooks
└── features/
    └── <feature>/
        └── modules/
            ├── <module>/
            │   └── hooks/
            │       └── useX/
            │           ├── useX.ts
            │           └── index.ts
            └── _shared/
                └── hooks/       ← hooks shared across modules in the feature
```

One hook per folder. Exported function name must match folder (`useProfile/` → `export function useProfile`).

---

## Return shape conventions

| Field                                             | Type                    | When                                     |
| ------------------------------------------------- | ----------------------- | ---------------------------------------- |
| `data` (or domain alias, e.g. `profile`)          | `T \| null`             | always                                   |
| `isLoading`                                       | `boolean`               | always                                   |
| `isMutating`                                      | `boolean`               | only when hook includes `useSWRMutation` |
| `error`                                           | `ApiError \| undefined` | always                                   |
| `trigger` (aliased to verb, e.g. `updateProfile`) | `function`              | only for mutations                       |

---

## What NOT to do

- Do not import global `mutate` from `swr` — use bound mutate from `useSWR`/`useSWRImmutable` or `useSWRConfig` for multi-key invalidation
- Do not hardcode URL strings — always use `SWR_KEYS`
- Do not build query strings manually with `URLSearchParams` — use `buildQueryString` (it sorts params)
- Do not use `useSWRMutation` when you only need invalidation — use `useSWRConfig` + `startsWith` instead
