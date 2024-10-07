import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { firstValueFrom, Observable } from "rxjs";
import { ApiException } from "../common/api-exception.swagger";
import { OrderDto, orderRequestQuery } from "../common/filter";
import { CustomThrottlerGuard } from "../common/guards";
import { CreateMovieDto, GenreDto } from "./dto";
import { ApiGatewayMovieService } from "./movie.service";
import { commonResponse, findAllResponse } from "./movie.swagger";
import { LoggerService } from "../logger/services";
import { LoggerKey } from "../logger/types";
import { TransformResponseInterceptor } from "../common/interceptors";
import { Movie } from "./movie.types";

@ApiCookieAuth()
@ApiSecurity({ "x-tmdb-nestjs-csrf": [] })
@ApiTags("movie")
@ApiBadRequestResponse({ type: ApiException })
@UseGuards(CustomThrottlerGuard)
@Controller("movie")
export class ApiGatewayMovieController {
  constructor(
    private readonly movieService: ApiGatewayMovieService,
    @Inject(LoggerKey) private logger: LoggerService,
  ) {
    this.logger.setOrganizationAndContext(ApiGatewayMovieController.name);
  }

  @Get()
  @ApiQuery(orderRequestQuery)
  @ApiResponse(findAllResponse)
  @ApiExtraModels(OrderDto)
  @UseInterceptors(TransformResponseInterceptor(Movie))
  getMovies(@Query("orderBy") orderBy?: OrderDto): Observable<Movie[]> {
    return this.movieService.getMovies(orderBy);
  }

  @Get("/:movieId")
  @ApiParam({ name: "movieId", example: "55" })
  @ApiResponse(commonResponse)
  @UseInterceptors(TransformResponseInterceptor(Movie))
  findMovie(
    @Param("movieId") movieId: string,
  ): Observable<Movie | string | null> {
    return this.movieService.findMovie(movieId);
  }

  @Post()
  @ApiResponse(commonResponse)
  @ApiExtraModels(GenreDto)
  @UseInterceptors(TransformResponseInterceptor(Movie))
  createMovie(@Body() dto: CreateMovieDto): Observable<Movie | string | null> {
    return this.movieService.createMovie(dto);
  }

  @Delete("/:movieId")
  @ApiResponse(commonResponse)
  @ApiParam({
    required: true,
    name: "movieId",
    example: "55",
  })
  @UseInterceptors(TransformResponseInterceptor(Movie))
  deleteMovie(
    @Param("movieId") movieId: string,
  ): Observable<Movie | string | null> {
    return this.movieService.deleteMovie(movieId);
  }
}
