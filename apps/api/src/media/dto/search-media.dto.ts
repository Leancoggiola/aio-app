import { IsString, IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { SEARCH_TYPES } from '@aio-app/shared/constants/media';

export class SearchMediaDto {
  @IsString()
  query!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsIn(SEARCH_TYPES)
  type?: string = 'multi';
}
