import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type {
  TmdbSearchResponse,
  TmdbMediaResult,
  TmdbMovieDetail,
  TmdbTvDetail,
} from '@aio-app/shared/types/media';

export type { TmdbSearchResponse, TmdbMediaResult, TmdbMovieDetail, TmdbTvDetail };

@Injectable()
export class TmdbService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.apiKey = this.config.getOrThrow<string>('TMDB_API_KEY');
    this.baseUrl =
      this.config.get<string>('TMDB_BASE_URL') ||
      'https://api.themoviedb.org/3';
  }

  private async get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const { data } = await firstValueFrom(
      this.http.get<T>(url, {
        params: { api_key: this.apiKey, language: 'es-ES', ...params },
      }),
    );
    return data;
  }

  async searchMulti(query: string, page = 1): Promise<TmdbSearchResponse> {
    const result = await this.get<TmdbSearchResponse>('/search/multi', { query, page });
    // Filter out people results — only keep movie and tv
    result.results = result.results.filter(
      (r) => r.media_type === 'movie' || r.media_type === 'tv',
    );
    return result;
  }

  async searchMovies(query: string, page = 1): Promise<TmdbSearchResponse> {
    return this.get<TmdbSearchResponse>('/search/movie', { query, page });
  }

  async searchTv(query: string, page = 1): Promise<TmdbSearchResponse> {
    return this.get<TmdbSearchResponse>('/search/tv', { query, page });
  }

  async getMovieDetail(tmdbId: number): Promise<TmdbMovieDetail> {
    return this.get<TmdbMovieDetail>(`/movie/${tmdbId}`);
  }

  async getTvDetail(tmdbId: number): Promise<TmdbTvDetail> {
    return this.get<TmdbTvDetail>(`/tv/${tmdbId}`);
  }

}
