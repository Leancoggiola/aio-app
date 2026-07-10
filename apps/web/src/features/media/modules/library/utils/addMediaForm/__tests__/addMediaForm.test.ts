import { describe, expect, it } from 'vitest';

import { INITIAL_ADD_MEDIA_FORM_VALUES } from '../addMediaForm';

describe('addMediaForm utils', () => {
  it('exposes empty initial form values', () => {
    expect(INITIAL_ADD_MEDIA_FORM_VALUES).toEqual({
      titleQuery: '',
      tmdbId: null,
      mediaType: 'movie',
      status: 'to_watch',
    });
  });
});
