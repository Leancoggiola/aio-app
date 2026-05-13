import { config } from "../config";
import type {
  TmdbSearchResponse,
  TmdbMediaResult,
  TmdbMovieDetail,
  TmdbTvDetail,
} from "@aio-app/shared/media";

export type {
  TmdbSearchResponse,
  TmdbMediaResult,
  TmdbMovieDetail,
  TmdbTvDetail,
};

async function get<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(`${config.tmdb.baseUrl}${path}`);
  url.searchParams.set("api_key", config.tmdb.apiKey);
  url.searchParams.set("language", "es-ES");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw { status: res.status, message: `TMDB API error: ${res.statusText}` };
  }
  return res.json() as Promise<T>;
}

export async function searchMulti(
  query: string,
  page = 1,
): Promise<TmdbSearchResponse> {
  const result = await get<TmdbSearchResponse>("/search/multi", {
    query,
    page,
  });
  result.results = result.results.filter(
    (r: TmdbMediaResult) => r.media_type === "movie" || r.media_type === "tv",
  );
  return result;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<TmdbSearchResponse> {
  return get<TmdbSearchResponse>("/search/movie", { query, page });
}

export async function searchTv(
  query: string,
  page = 1,
): Promise<TmdbSearchResponse> {
  return get<TmdbSearchResponse>("/search/tv", { query, page });
}

export async function getMovieDetail(tmdbId: number): Promise<TmdbMovieDetail> {
  return get<TmdbMovieDetail>(`/movie/${tmdbId}`);
}

export async function getTvDetail(tmdbId: number): Promise<TmdbTvDetail> {
  return get<TmdbTvDetail>(`/tv/${tmdbId}`);
}
