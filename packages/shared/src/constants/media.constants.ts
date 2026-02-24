import type { MediaType, MediaStatus } from "../types/media.types";

export const MEDIA_TYPES: MediaType[] = ["movie", "tv"] as const;
export const MEDIA_STATUSES: MediaStatus[] = [
  "to_watch",
  "watching",
  "watched",
] as const;
export const SEARCH_TYPES = ["movie", "tv", "multi"] as const;

/** Display labels (Spanish) for media types */
export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  movie: "Película",
  tv: "Serie",
};

/** Display labels (Spanish) for media statuses */
export const MEDIA_STATUS_LABELS: Record<MediaStatus, string> = {
  to_watch: "Quiero Ver",
  watching: "Viendo",
  watched: "Ya Vi",
};

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const TMDB_POSTER_W300 = `${TMDB_IMAGE_BASE}/w300`;
