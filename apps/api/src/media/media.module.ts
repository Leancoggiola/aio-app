import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaItem, MediaItemSchema } from './schemas/media-item.schema';
import { TmdbService } from './tmdb.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: MediaItem.name, schema: MediaItemSchema },
    ]),
  ],
  providers: [TmdbService, MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
