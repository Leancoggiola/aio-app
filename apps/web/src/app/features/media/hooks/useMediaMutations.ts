import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, SWR_KEYS } from '@/common/api';

import type { MediaItem, MediaStatus, MediaType } from '../types';

export function useMediaMutations() {
  const { mutate } = useSWRConfig();

  const invalidateList = useCallback(() => {
    mutate((key: unknown) => typeof key === 'string' && key.startsWith(SWR_KEYS.media.list), undefined, {
      revalidate: true,
    });
  }, [mutate]);

  const addToList = useCallback(
    async (tmdbId: number, mediaType: MediaType, status: MediaStatus = 'to_watch') => {
      const item = await api.post<MediaItem>(SWR_KEYS.media.list, {
        tmdbId,
        mediaType,
        status,
      });
      await invalidateList();
      return item;
    },
    [invalidateList]
  );

  const updateStatus = useCallback(
    async (itemId: string, status: MediaStatus) => {
      const item = await api.patch<MediaItem>(`/api/media/list/${itemId}`, {
        status,
      });
      await invalidateList();
      return item;
    },
    [invalidateList]
  );

  const removeFromList = useCallback(
    async (itemId: string) => {
      await api.delete(`/api/media/list/${itemId}`);
      await invalidateList();
    },
    [invalidateList]
  );

  return { addToList, updateStatus, removeFromList };
}
