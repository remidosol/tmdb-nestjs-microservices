import { Args, Query, Resolver } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { ApiGatewayMovieService } from "./movie.service";
import { Movie } from "./movie.types";
import { LoggerService } from "../logger/services";
import { Inject } from "@nestjs/common";
import { LoggerKey } from "../logger/types";

@Resolver(() => Movie)
export class MovieResolver {
  constructor(
    private readonly movieService: ApiGatewayMovieService,
    @Inject(LoggerKey) private logger: LoggerService,
  ) {
    this.logger.setOrganizationAndContext(MovieResolver.name);
  }

  @Query(() => Movie, { name: "findMovie" })
  findMovie(@Args("id") id: string): Observable<Movie | null> {
    return this.movieService.findMovie(id);
  }
}
