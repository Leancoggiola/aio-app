import useSWR from "swr";
import type { TmdbSearchResponse } from "../types";

export function useMediaSearch(query: string, page = 1, type = "multi") {
  const params = new URLSearchParams({ query, page: String(page), type });
  const key = query.trim() ? `/api/media/search?${params.toString()}` : null;

  return useSWR<TmdbSearchResponse>(key, {
    keepPreviousData: true,
  });
}
