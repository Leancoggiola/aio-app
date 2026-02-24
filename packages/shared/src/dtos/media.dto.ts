import type { MediaType, MediaStatus } from "../types/media.types";

export interface AddMediaItemPayload {
  tmdbId: number;
  mediaType: MediaType;
  status?: MediaStatus;
}

export interface UpdateMediaItemPayload {
  status: MediaStatus;
}

export interface SearchMediaParams {
  query: string;
  page?: number;
  type?: "movie" | "tv" | "multi";
}

export interface FilterMediaParams {
  status?: MediaStatus;
  mediaType?: MediaType;
}
