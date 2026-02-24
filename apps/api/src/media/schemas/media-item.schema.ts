import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type {
  MediaType,
  MediaStatus,
} from '@aio-app/shared/types/media';

export type { MediaType, MediaStatus };
export type MediaItemDocument = HydratedDocument<MediaItem>;

@Schema({ timestamps: true })
export class MediaItem {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  tmdbId!: number;

  @Prop({ required: true, enum: ['movie', 'tv'] })
  mediaType!: MediaType;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ type: String, default: null })
  posterPath!: string | null;

  @Prop({ type: String, default: null })
  streamingReleaseDate!: string | null;

  @Prop({ required: true, enum: ['to_watch', 'watching', 'watched'], default: 'to_watch' })
  status!: MediaStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export const MediaItemSchema = SchemaFactory.createForClass(MediaItem);

// Prevent duplicate entries per user
MediaItemSchema.index({ userId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });
