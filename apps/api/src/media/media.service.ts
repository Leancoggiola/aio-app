import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { MediaType } from '@aio-app/shared/types/media';

import { MediaItem, MediaItemDocument } from './schemas/media-item.schema';
import { TmdbService } from './tmdb.service';
import { AddMediaItemDto, FilterMediaDto, UpdateMediaItemDto } from './dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(MediaItem.name)
    private readonly mediaItemModel: Model<MediaItemDocument>,
    private readonly tmdbService: TmdbService,
  ) {}

  async search(query: string, page: number, type: string) {
    switch (type) {
      case 'movie':
        return this.tmdbService.searchMovies(query, page);
      case 'tv':
        return this.tmdbService.searchTv(query, page);
      default:
        return this.tmdbService.searchMulti(query, page);
    }
  }

  async getTmdbDetail(type: MediaType, tmdbId: number) {
    if (type === 'movie') {
      return this.tmdbService.getMovieDetail(tmdbId);
    }
    return this.tmdbService.getTvDetail(tmdbId);
  }

  async addToList(
    userId: string,
    dto: AddMediaItemDto,
  ): Promise<MediaItemDocument> {
    // Check for duplicate
    const existing = await this.mediaItemModel.findOne({
      userId: new Types.ObjectId(userId),
      tmdbId: dto.tmdbId,
      mediaType: dto.mediaType,
    });

    if (existing) {
      throw new ConflictException('This item is already in your list');
    }

    // Fetch details from TMDB to store denormalized data
    let title: string;
    let posterPath: string | null;

    if (dto.mediaType === 'movie') {
      const detail = await this.tmdbService.getMovieDetail(dto.tmdbId);
      title = detail.title;
      posterPath = detail.poster_path;
    } else {
      const detail = await this.tmdbService.getTvDetail(dto.tmdbId);
      title = detail.name;
      posterPath = detail.poster_path;
    }

    const item = new this.mediaItemModel({
      userId: new Types.ObjectId(userId),
      tmdbId: dto.tmdbId,
      mediaType: dto.mediaType,
      title,
      posterPath,
      status: dto.status || 'to_watch',
    });

    return item.save();
  }

  async getList(
    userId: string,
    filters: FilterMediaDto,
  ) {
    const query: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };

    if (filters.status) query.status = filters.status;
    if (filters.mediaType) query.mediaType = filters.mediaType;

    return this.mediaItemModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async updateStatus(
    userId: string,
    itemId: string,
    dto: UpdateMediaItemDto,
  ): Promise<MediaItemDocument> {
    const item = await this.mediaItemModel.findOneAndUpdate(
      { _id: new Types.ObjectId(itemId), userId: new Types.ObjectId(userId) },
      { status: dto.status },
      { new: true },
    );

    if (!item) {
      throw new NotFoundException('Media item not found');
    }

    return item;
  }

  async removeFromList(userId: string, itemId: string): Promise<void> {
    const result = await this.mediaItemModel.deleteOne({
      _id: new Types.ObjectId(itemId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Media item not found');
    }
  }
}
