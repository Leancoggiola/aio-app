import useSWR from 'swr';

import { api, API_KEYS, buildQueryString } from '@/shared/api';

import type { MediaItem, MediaStatus, MediaType } from '@omni/shared/media';

export type MediaFilters = {
  status?: MediaStatus;
  mediaType?: MediaType;
};

export function useMyMediaList(filters: MediaFilters = {}) {
  const qs = buildQueryString({
    status: filters.status,
    mediaType: filters.mediaType,
  });
  const key = `${API_KEYS.media.list}${qs}`;
  const { data, error, isLoading, mutate } = useSWR<MediaItem[]>(key);

  return { data, error, isLoading, mutate };
}

export function useMediaMutations() {
  const addToList = async (
    tmdbId: number,
    mediaType: MediaType,
    status: MediaStatus,
    streamingReleaseDate?: string | null
  ) => {
    return api.post<MediaItem>(API_KEYS.media.list, {
      tmdbId,
      mediaType,
      status,
      ...(streamingReleaseDate != null && { streamingReleaseDate }),
    });
  };

  const updateStatus = async (id: string, status: MediaStatus) => {
    return api.patch<MediaItem>(API_KEYS.media.listItem(id), { status });
  };

  const removeFromList = async (id: string) => {
    return api.delete(API_KEYS.media.listItem(id));
  };

  return { addToList, updateStatus, removeFromList };
}

export function useMediaSearch(query: string, type?: MediaType | 'all') {
  const enabled = query.trim().length >= 2;
  const qs = buildQueryString({
    query: enabled ? query.trim() : undefined,
    type: type && type !== 'all' ? type : undefined,
  });
  const key = enabled ? `${API_KEYS.media.search}${qs}` : null;
  const { data, error, isLoading } = useSWR<import('@omni/shared/media').TmdbSearchResponse>(key);

  return { results: data?.results ?? [], error, isLoading };
}
