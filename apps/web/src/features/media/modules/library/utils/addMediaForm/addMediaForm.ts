import { formatDateToIsoDateString } from '@/shared/dates';

import type { AddMediaFormValues } from '@omni/shared/media';

export const INITIAL_ADD_MEDIA_FORM_VALUES: AddMediaFormValues = {
  titleQuery: '',
  tmdbId: null,
  mediaType: 'movie',
  status: 'to_watch',
  streamingReleaseDate: null,
};

export function toStreamingReleaseDateString(date: Date | null): string | null {
  if (!date) return null;
  return formatDateToIsoDateString(date);
}

export type { AddMediaFormValues };
