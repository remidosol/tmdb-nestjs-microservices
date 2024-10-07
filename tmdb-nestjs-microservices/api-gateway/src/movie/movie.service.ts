import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { OrderDto } from "../common/filter";
import { Movie } from "../common/types";
import { catchError } from "../common/util.functions";
import { LoggerService } from "../logger/services";
import { LoggerKey } from "../logger/types";
import { CreateMovieDto } from "./dto";
import { MOVIE_SERVICE } from "./movie.types";

@Injectable()
export class ApiGatewayMovieService implements OnModuleInit, OnModuleDestroy {
  protected requestPatterns = [
    "getMovies",
    "findMovie",
    "createMovie",
    "deleteMovie",
  ];

  constructor(
    @Inject(MOVIE_SERVICE) private readonly movieKafkaClient: ClientKafka,
    @Inject(LoggerKey) private logger: LoggerService,
  ) {
    this.logger.setOrganizationAndContext(ApiGatewayMovieService.name);
  }

  async onModuleInit() {
    this.requestPatterns.forEach((pattern) => {
      this.movieKafkaClient.subscribeToResponseOf(pattern);
    });

    await this.movieKafkaClient.connect();
    this.logger.info("Movie Kafka Client connected");
  }

  async onModuleDestroy() {
    await this.movieKafkaClient.close();
    this.logger.info("Movie Kafka Client disconnected");
  }

  /**
   * Get movies
   *
   * @returns [`Movie`](./movie.schema.ts) array or `null`
   */
  getMovies(order?: OrderDto): Observable<Movie[]> {
    try {
      return this.movieKafkaClient.send<Movie[]>(
        "getMovies",
        JSON.stringify(order),
      );
    } catch (err: any) {
      this.logger.error(err);
      throw catchError(err, this.logger);
    }
  }

  /**
   * Find movie by id
   *
   * @param {String} movieId - movie id
   * @returns a [`Movie`](./movie.schema.ts) or `null`
   */
  findMovie(movieId: string): Observable<Movie | null> {
    try {
      return this.movieKafkaClient.send<Movie | null>("findMovie", movieId);
    } catch (err: any) {
      this.logger.error(err);
      throw catchError(err, this.logger);
    }
  }

  /**
   * Creates an Movie
   *
   * @param dto [`CreateMovieDto`](./dto/create-movie.dto.ts) - DTO Object
   * @returns [`Movie`](./movie.schema.ts) - Created Movie
   */
  createMovie(dto: CreateMovieDto): Observable<Movie | null> {
    try {
      return this.movieKafkaClient.send<Movie | null>(
        "createMovie",
        JSON.stringify(dto),
      );
    } catch (err: any) {
      this.logger.error(err);
      throw catchError(err, this.logger);
    }
  }

  /**
   * Deletes an movie
   *
   * @param {String} movieId - movie id
   * @returns [`Movie`](./movie.schema.ts) - Deleted movie
   */
  deleteMovie(movieId: string): Observable<Movie | null> {
    try {
      return this.movieKafkaClient.send<Movie>("deleteMovie", movieId);
    } catch (err: any) {
      this.logger.error(err);
      throw catchError(err, this.logger);
    }
  }
}
