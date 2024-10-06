import { Inject, Injectable, Logger } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import * as https from "https";
import { ConfigService } from "../config/config.service";
import { TmdbDiscoverMovieRequest, TmdbDiscoverMovieResponse, TmdbMovieDetailResponse } from "../types";
import { LoggerService } from "../logger/services";
import { LoggerKey } from "../logger/types";

@Injectable()
export class TmdbApiService {
  private readonly axiosInstance!: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    @Inject(LoggerKey) private logger: LoggerService
  ) {
    this.logger.setOrganizationAndContext(TmdbApiService.name);
    this.axiosInstance = axios.create(
      configService.getOrThrow("NODE_ENV") === "development"
        ? {
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
            baseURL: configService.getOrThrow("TMDB_BASE_URL"),
            ...(configService.get("TMDB_READ_ACCESS_TOKEN")
              ? {
                  headers: {
                    Authorization: `Bearer ${configService.getOrThrow("TMDB_READ_ACCESS_TOKEN")}`,
                  },
                }
              : {
                  params: {
                    api_key: configService.getOrThrow("TMDB_API_KEY"),
                  },
                }),
          }
        : {
            ...(configService.get("TMDB_READ_ACCESS_TOKEN")
              ? {
                  headers: {
                    Authorization: `Bearer ${configService.getOrThrow("TMDB_READ_ACCESS_TOKEN")}`,
                  },
                }
              : {
                  params: {
                    api_key: configService.getOrThrow("TMDB_API_KEY"),
                  },
                }),
            baseURL: configService.getOrThrow("TMDB_BASE_URL"),
          }
    );
  }

  /**
   * Discover movies
   *
   * @param params [`TmdbDiscoverMovieRequest`](./types/tmdb-request.types.ts)
   * @returns [`TmdbDiscoverMovieResponse`](./types/tmdb-response.types.ts)
   */
  async discoverMovies(params: TmdbDiscoverMovieRequest): Promise<TmdbDiscoverMovieResponse | null> {
    try {
      // console.log(params);

      const response = await this.axiosInstance.get<TmdbDiscoverMovieResponse>("/discover/movie", {
        params,
      });

      // console.log(response.data);

      return response.status === 200 ? response.data : null;
    } catch (err: any) {
      err.status ? this.logger.info(err.message, { error: err }) : this.logger.error(err.message, { error: err });
      // console.error(JSON.stringify(err.response.data, null, 2));
      return null;
    }
  }

  /**
   * Get movie details by movie id
   *
   * @param params [`TmdbDiscoverMovieRequest`](./types/tmdb-request.types.ts)
   * @returns [`TmdbMovieDetailResponse`](./types/tmdb-response.types.ts)
   */
  async getMovieDetails(movieId: string): Promise<TmdbMovieDetailResponse | null> {
    try {
      const response = await this.axiosInstance.get<TmdbMovieDetailResponse>(`/movie/${movieId}`);

      return response.status === 200 ? response.data : null;
    } catch (err: any) {
      err.status ? this.logger.info(err.message, { error: err }) : this.logger.error(err.message, { error: err });
      // console.error(JSON.stringify(err.response.data, null, 2));
      return null;
    }
  }
}
