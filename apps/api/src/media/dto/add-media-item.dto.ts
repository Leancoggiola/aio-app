import { IsInt, IsIn, IsOptional } from 'class-validator';
import type { MediaType, MediaStatus } from '@aio-app/shared/types/media';
import { MEDIA_TYPES, MEDIA_STATUSES } from '@aio-app/shared/constants/media';

export class AddMediaItemDto {
  @IsInt()
  tmdbId!: number;

  @IsIn(MEDIA_TYPES)
  mediaType!: MediaType;

  @IsOptional()
  @IsIn(MEDIA_STATUSES)
  status?: MediaStatus = 'to_watch';
}
