import type { MediaType, TmdbMediaResult } from '../../types';

export function resolveMediaType(item: TmdbMediaResult): MediaType {
  if (item.media_type === 'tv') return 'tv';
  if (item.media_type === 'movie') return 'movie';
  return item.title ? 'movie' : 'tv';
}

export function buildMediaTmdbKey(mediaType: MediaType, tmdbId: number): string {
  return `${mediaType}-${tmdbId}`;
}

export function getTmdbResultKey(item: TmdbMediaResult): string {
  return buildMediaTmdbKey(resolveMediaType(item), item.id);
}

export function getTmdbResultTitle(item: TmdbMediaResult): string {
  return item.title || item.name || 'Sin título';
}
