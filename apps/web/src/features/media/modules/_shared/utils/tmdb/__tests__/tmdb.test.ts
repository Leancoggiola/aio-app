import { describe, expect, it } from 'vitest';

import { buildMediaTmdbKey, getTmdbResultKey, getTmdbResultTitle, resolveMediaType } from '../tmdb';

import type { TmdbMediaResult } from '../../../types';

function makeResult(overrides: Partial<TmdbMediaResult> = {}): TmdbMediaResult {
  return {
    id: 42,
    media_type: 'movie',
    title: 'Dune',
    poster_path: null,
    ...overrides,
  };
}

describe('tmdb utils', () => {
  it('resolves media type from media_type or title/name fallback', () => {
    expect(resolveMediaType(makeResult({ media_type: 'tv', name: 'Show' }))).toBe('tv');
    expect(resolveMediaType(makeResult({ media_type: 'movie' }))).toBe('movie');
    expect(resolveMediaType(makeResult({ media_type: undefined, title: 'Film', name: undefined }))).toBe('movie');
    expect(resolveMediaType(makeResult({ media_type: undefined, title: undefined, name: 'Series' }))).toBe('tv');
  });

  it('builds stable tmdb keys', () => {
    expect(buildMediaTmdbKey('movie', 42)).toBe('movie-42');
    expect(getTmdbResultKey(makeResult({ id: 7, media_type: 'tv', name: 'Show' }))).toBe('tv-7');
  });

  it('prefers title, then name, then a default label', () => {
    expect(getTmdbResultTitle(makeResult({ title: 'Dune', name: 'Ignored' }))).toBe('Dune');
    expect(getTmdbResultTitle(makeResult({ title: undefined, name: 'Andor' }))).toBe('Andor');
    expect(getTmdbResultTitle(makeResult({ title: undefined, name: undefined }))).toBe('Sin título');
  });
});
