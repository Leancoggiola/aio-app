import type { AddMediaFormValues } from '@omni/shared/media';

export const INITIAL_ADD_MEDIA_FORM_VALUES: AddMediaFormValues = {
  titleQuery: '',
  tmdbId: null,
  mediaType: 'movie',
  status: 'to_watch',
};

export type { AddMediaFormValues };
