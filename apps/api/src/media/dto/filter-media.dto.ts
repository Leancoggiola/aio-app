import { IsOptional, IsIn } from 'class-validator';
import type { MediaType, MediaStatus } from '@aio-app/shared/types/media';
import { MEDIA_TYPES, MEDIA_STATUSES } from '@aio-app/shared/constants/media';

export class FilterMediaDto {
  @IsOptional()
  @IsIn(MEDIA_STATUSES)
  status?: MediaStatus;

  @IsOptional()
  @IsIn(MEDIA_TYPES)
  mediaType?: MediaType;
}
