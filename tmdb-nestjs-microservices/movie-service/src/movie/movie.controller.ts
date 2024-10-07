import { Controller, UseFilters, UseInterceptors } from "@nestjs/common";
import { Ctx, KafkaContext, MessagePattern } from "@nestjs/microservices";
import { OrderDto } from "../common/filter";
import { TransformResponseInterceptor } from "../common/interceptors";
import { MongoExceptionFilter } from "../common/mongo/mongo-exception.filter";
import { CreateMovieDto } from "./dto";
import { MovieService } from "./movie.service";
import { Movie } from "./schemas";

@UseFilters(MongoExceptionFilter)
@Controller("movie")
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern("getMovies")
  @UseInterceptors(TransformResponseInterceptor(Movie))
  async getMovies(@Ctx() ctx: KafkaContext): Promise<Movie[] | any> {
    const orderBy: OrderDto = ctx.getMessage().value as any;

    // console.log("orderBy", ctx.getMessage().value);

    return this.movieService.getMovies(
      orderBy?.field && orderBy?.order
        ? { [orderBy.field]: orderBy.order === "asc" ? 1 : -1 }
        : undefined,
    );
  }

  @MessagePattern("findMovie")
  @UseInterceptors(TransformResponseInterceptor(Movie))
  async findMovie(@Ctx() ctx: KafkaContext): Promise<Movie | null> {
    const movieId = ctx.getMessage().value as any;

    // console.log(JSON.stringify(await this.movieService.findMovie(movieId), null, 2));

    return this.movieService.findMovie(movieId);
  }

  @MessagePattern("createMovie")
  @UseInterceptors(TransformResponseInterceptor(Movie))
  async createMovie(@Ctx() ctx: KafkaContext): Promise<Movie | null> {
    const value = ctx.getMessage().value as any;

    const dto = new CreateMovieDto({ ...value });

    // console.log("createMovie", await this.movieService.createMovie(dto));

    return this.movieService.createMovie(dto);
  }

  @MessagePattern("deleteMovie")
  @UseInterceptors(TransformResponseInterceptor(Movie))
  async deleteMovie(@Ctx() ctx: KafkaContext): Promise<Movie> {
    const movieId = ctx.getMessage().value as any;

    return this.movieService.deleteMovie(movieId);
  }
}
