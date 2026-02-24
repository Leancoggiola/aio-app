import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import type { MediaType } from '@aio-app/shared/types/media';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import {
  SearchMediaDto,
  AddMediaItemDto,
  UpdateMediaItemDto,
  FilterMediaDto,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('search')
  async search(@Query() dto: SearchMediaDto) {
    return this.mediaService.search(dto.query, dto.page ?? 1, dto.type ?? 'multi');
  }

  @Get('tmdb/:type/:id')
  async tmdbDetail(
    @Param('type') type: MediaType,
    @Param('id') id: string,
  ) {
    return this.mediaService.getTmdbDetail(type, +id);
  }

  @Get('list')
  async getList(@Req() req: Request, @Query() filters: FilterMediaDto) {
    const { userId } = req.user as { userId: string };
    return this.mediaService.getList(userId, filters);
  }

  @Post('list')
  async addToList(@Req() req: Request, @Body() dto: AddMediaItemDto) {
    const { userId } = req.user as { userId: string };
    return this.mediaService.addToList(userId, dto);
  }

  @Patch('list/:id')
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateMediaItemDto,
  ) {
    const { userId } = req.user as { userId: string };
    return this.mediaService.updateStatus(userId, id, dto);
  }

  @Delete('list/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromList(@Req() req: Request, @Param('id') id: string) {
    const { userId } = req.user as { userId: string };
    await this.mediaService.removeFromList(userId, id);
  }
}
