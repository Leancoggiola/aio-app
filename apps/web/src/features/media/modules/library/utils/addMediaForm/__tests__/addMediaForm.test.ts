import { describe, expect, it } from 'vitest';

import { INITIAL_ADD_MEDIA_FORM_VALUES, toStreamingReleaseDateString } from '../addMediaForm';

describe('addMediaForm utils', () => {
  it('exposes empty initial form values', () => {
    expect(INITIAL_ADD_MEDIA_FORM_VALUES).toEqual({
      titleQuery: '',
      tmdbId: null,
      mediaType: 'movie',
      status: 'to_watch',
      streamingReleaseDate: null,
    });
  });

  it('returns null when streaming release date is missing', () => {
    expect(toStreamingReleaseDateString(null)).toBeNull();
  });

  it('formats a Date to YYYY-MM-DD without UTC shift', () => {
    expect(toStreamingReleaseDateString(new Date(2026, 6, 9))).toBe('2026-07-09');
  });
});
