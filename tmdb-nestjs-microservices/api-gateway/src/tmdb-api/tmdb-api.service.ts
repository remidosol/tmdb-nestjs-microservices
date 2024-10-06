import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { map, Observable, of, onErrorResumeNextWith } from "rxjs";
import { LoggerService } from "../logger/services";
import { LoggerKey } from "../logger/types";
import {
  TMDB_API_SERVICE,
  TmdbDiscoverMovieRequest,
  TmdbDiscoverMovieResponse,
  TmdbMovieDetailResponse,
} from "./types";

@Injectable()
export class ApiGatewayTmdbApiService implements OnModuleInit, OnModuleDestroy {
  protected requestPatterns = ["discoverMovies", "getMovieDetails"];

  constructor(
    @Inject(TMDB_API_SERVICE) private readonly tmdbServiceKafkaClient: ClientKafka,
    @Inject(LoggerKey) private logger: LoggerService
  ) {
    this.logger.setOrganizationAndContext(ApiGatewayTmdbApiService.name);
  }

  async onModuleInit() {
    this.requestPatterns.forEach((pattern) => {
      this.tmdbServiceKafkaClient.subscribeToResponseOf(pattern);
    });

    await this.tmdbServiceKafkaClient.connect();
    this.logger.info("Connected to TMDB API service");
  }

  async onModuleDestroy() {
    await this.tmdbServiceKafkaClient.close();
    this.logger.info("Disconnected from TMDB API service");
  }

  /**
   * Discover movies
   *
   * @param params [`TmdbDiscoverMovieRequest`](./types/tmdb-request.types.ts)
   * @returns [`TmdbDiscoverMovieResponse`](./types/tmdb-response.types.ts)
   */
  discoverMovies(params: TmdbDiscoverMovieRequest): Observable<TmdbDiscoverMovieResponse | null> {
    try {
      // console.log("discoverMovies", params);
      return this.tmdbServiceKafkaClient
        .send<TmdbDiscoverMovieResponse | null>("discoverMovies", JSON.stringify(params))
        .pipe(map((data) => data ?? null));
    } catch (err: any) {
      err.status ? this.logger.info(err.message, { error: err }) : this.logger.error(err.message, { error: err });
      // console.error(JSON.stringify(err.response.data, null, 2));
      return of(null);
    }
  }

  /**
   * Get movie details by movie id
   *
   * @param params [`TmdbDiscoverMovieRequest`](./types/tmdb-request.types.ts)
   * @returns [`TmdbMovieDetailResponse`](./types/tmdb-response.types.ts)
   */
  getMovieDetails(movieId: string): Observable<TmdbMovieDetailResponse | null> {
    try {
      return this.tmdbServiceKafkaClient
        .send<TmdbMovieDetailResponse | null>("getMovieDetails", movieId)
        .pipe(onErrorResumeNextWith(of(null)));
    } catch (err: any) {
      err.status ? this.logger.info(err.message, { error: err }) : this.logger.error(err.message, { error: err });
      // console.error(JSON.stringify(err.response.data, null, 2));
      return of(null);
    }
  }
}
