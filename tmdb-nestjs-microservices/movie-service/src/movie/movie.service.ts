import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  BadRequestExceptionMessageKeys,
  BadRequestExceptionMessages,
  NotFoundExceptionMessageKeys,
  NotFoundExceptionMessages,
} from "../common/error-message";
import { OrderQuery } from "../common/filter";
import { catchError } from "../common/util.functions";
import { LoggerService } from "../logger/services";
import { LoggerKey } from "../logger/types";
import { CreateMovieDto } from "./dto";
import { MovieRepository } from "./movie.repository";
import { Movie } from "./schemas";

@Injectable()
export class MovieService {
  constructor(
    private movieRepository: MovieRepository,
    @Inject(LoggerKey) private logger: LoggerService,
  ) {
    this.logger.setOrganizationAndContext(MovieService.name);
  }

  /**
   * Get movies
   *
   * @returns [`Movie`](./movie.schema.ts) array or `null`
   */
  async getMovies(order?: OrderQuery<Movie>): Promise<Movie[]> {
    try {
      if (order && Object.keys(order).length > 1) {
        this.logger.info(BadRequestExceptionMessages.SPECIFY_ONE_ORDER_FACTOR);
        throw new BadRequestException(
          BadRequestExceptionMessageKeys.SPECIFY_ONE_ORDER_FACTOR,
        );
      }

      return this.movieRepository.findAll(order);
    } catch (err: any) {
      // this.logger.error(err);
      throw catchError(err, this.logger);
    }
  }

  /**
   * Find movie by id
   *
   * @param {String} movieId - movie id
   * @returns a [`Movie`](./movie.schema.ts) or `null`
   */
  async findMovie(movieId: string): Promise<Movie | null> {
    try {
      const movie = await this.movieRepository.findById(movieId);

      return movie;
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
  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findById(dto.id);

    if (existingMovie) {
      this.logger.info(BadRequestExceptionMessageKeys.MOVIE_ALREADY_EXISTS);
      throw new BadRequestException(
        BadRequestExceptionMessages.MOVIE_ALREADY_EXISTS,
      );
    }

    try {
      const newMovie = new Movie();

      newMovie.name = dto.name;
      newMovie.id = dto.id;
      newMovie.overview = dto.overview;
      newMovie.popularity = dto.popularity;
      newMovie.voteAverage = dto.voteAverage;
      newMovie.voteCount = dto.voteCount;
      newMovie.releaseDate = dto.releaseDate;
      newMovie.genres = dto.genres;

      return this.movieRepository.save(newMovie);
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
  async deleteMovie(movieId: string): Promise<Movie> {
    try {
      const movie = await this.movieRepository.findById(movieId);

      if (!movie) {
        this.logger.info(NotFoundExceptionMessages.MOVIE_NOT_FOUND);
        throw new NotFoundException(
          NotFoundExceptionMessageKeys.MOVIE_NOT_FOUND,
        );
      }

      await this.movieRepository.removeById(movieId);

      return movie;
    } catch (err: any) {
      // this.logger.error(err);
      throw catchError(err, this.logger);
    }
  }
}
