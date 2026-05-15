import useSWR from "swr";

import type { MediaFilters, MediaItem } from "../types";

export function useMyMediaList(filters: MediaFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.mediaType) params.set("mediaType", filters.mediaType);

  const queryString = params.toString();
  const key = `/api/media/list${queryString ? `?${queryString}` : ""}`;

  return useSWR<MediaItem[]>(key);
}
