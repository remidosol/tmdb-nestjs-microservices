import { Controller, Inject, UseInterceptors } from "@nestjs/common";
import { TmdbApiService } from "./tmdb-api.service";
import { Ctx, KafkaContext, MessagePattern } from "@nestjs/microservices";
import {
  TmdbDiscoverMovieRequest,
  TmdbDiscoverMovieResponse,
  TmdbMovieDetailResponse,
} from "../types";
import { LoggerService } from "../logger/services";
import { LoggerKey } from "../logger/types";
import { TransformResponseInterceptor } from "../common";

@Controller()
export class TmdbApiController {
  constructor(
    private readonly tmdbApiService: TmdbApiService,
    @Inject(LoggerKey) private logger: LoggerService,
  ) {
    this.logger.setOrganizationAndContext(TmdbApiController.name);
  }

  @MessagePattern("discoverMovies")
  @UseInterceptors(TransformResponseInterceptor(Object))
  async discoverMovies(
    @Ctx() ctx: KafkaContext,
  ): Promise<TmdbDiscoverMovieResponse | null> {
    try {
      const params: TmdbDiscoverMovieRequest = ctx.getMessage().value as any;
      // console.log("discoverMovies", ctx.getMessage());
      // console.log("discoverMovies", params);

      return this.tmdbApiService.discoverMovies(params);
    } catch (err: any) {
      // err.status ? this.logger.verbose(err.message, { error: err }) : this.logger.error(err.message, { error: err });
      // console.error(JSON.stringify(err.response.data, null, 2));
      return null;
    }
  }

  @MessagePattern("getMovieDetails")
  @UseInterceptors(TransformResponseInterceptor(Object))
  async getMovieDetails(
    @Ctx() ctx: KafkaContext,
  ): Promise<TmdbMovieDetailResponse | null> {
    try {
      const movieId: string = ctx.getMessage().value as any;

      return await this.tmdbApiService.getMovieDetails(movieId);
    } catch (err: any) {
      // err.status ? this.logger.verbose(err.message, { error: err }) : this.logger.error(err.message, { error: err });
      // console.error(JSON.stringify(err.response.data, null, 2));
      return null;
    }
  }
}
