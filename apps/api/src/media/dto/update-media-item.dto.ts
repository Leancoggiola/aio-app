import { IsIn } from 'class-validator';
import type { MediaStatus } from '@aio-app/shared/types/media';
import { MEDIA_STATUSES } from '@aio-app/shared/constants/media';

export class UpdateMediaItemDto {
  @IsIn(MEDIA_STATUSES)
  status!: MediaStatus;
}
