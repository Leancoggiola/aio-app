import useSWR from 'swr';

import { buildQueryString, SWR_KEYS } from '@/common/api';

import type { MediaFilters, MediaItem } from '../types';

export function useMyMediaList(filters: MediaFilters = {}) {
  const key = `${SWR_KEYS.media.list}${buildQueryString({ mediaType: filters.mediaType, status: filters.status })}`;

  return useSWR<MediaItem[]>(key);
}
