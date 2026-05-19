import { z } from 'zod';
import { MEDIA_TYPES, MEDIA_STATUSES, SEARCH_TYPES } from './constants';

export const addMediaItemSchema = z.object({
  tmdbId: z.number().int(),
  mediaType: z.enum(MEDIA_TYPES),
  status: z.enum(MEDIA_STATUSES).default('to_watch'),
});
export type AddMediaItemPayload = z.infer<typeof addMediaItemSchema>;

export const updateMediaItemSchema = z.object({
  status: z.enum(MEDIA_STATUSES),
});
export type UpdateMediaItemPayload = z.infer<typeof updateMediaItemSchema>;

export const searchMediaSchema = z.object({
  query: z.string(),
  page: z.coerce.number().int().min(1).default(1),
  type: z.enum(SEARCH_TYPES).default('multi'),
});
export type SearchMediaParams = z.infer<typeof searchMediaSchema>;

export const filterMediaSchema = z.object({
  status: z.enum(MEDIA_STATUSES).optional(),
  mediaType: z.enum(MEDIA_TYPES).optional(),
});
export type FilterMediaParams = z.infer<typeof filterMediaSchema>;
