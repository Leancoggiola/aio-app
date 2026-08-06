import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, SWR_KEYS } from '@/shared/api';

import type { MediaItem, MediaStatus, MediaType } from '../../types';

export function useMediaMutations() {
  const { mutate } = useSWRConfig();
  const listKey = SWR_KEYS.media.list;

  const addToList = useCallback(
    async (tmdbId: number, mediaType: MediaType, status: MediaStatus = 'to_watch') => {
      const item = await api.post<MediaItem>(listKey, {
        tmdbId,
        mediaType,
        status,
      });

      await mutate(listKey, (current: MediaItem[] | undefined) => (current ? [item, ...current] : [item]), {
        revalidate: false,
      });

      return item;
    },
    [mutate, listKey]
  );

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

  const removeFromList = useCallback(
    async (itemId: string) => {
      await mutate(
        listKey,
        async (current: MediaItem[] | undefined) => {
          await api.delete(SWR_KEYS.media.listItem(itemId));
          return current?.filter(item => item.id !== itemId) ?? [];
        },
        {
          optimisticData: (current: MediaItem[] | undefined) => current?.filter(item => item.id !== itemId) ?? [],
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );
    },
    [mutate, listKey]
  );

  return { addToList, updateStatus, removeFromList };
}
