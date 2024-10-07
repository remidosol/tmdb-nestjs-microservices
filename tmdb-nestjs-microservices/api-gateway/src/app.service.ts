import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import { Response } from "express";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "./config/config.service";
import { ApiGatewayMovieService } from "./movie/movie.service";
import { Movie } from "./movie/movie.types";
import { ApiGatewayTmdbApiService } from "./tmdb-api/tmdb-api.service";

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly movieService: ApiGatewayMovieService,
    private readonly tmdbApiService: ApiGatewayTmdbApiService,
  ) {}

  /**
   * Use to generate csrf token
   *
   * @param res
   * @returns csrf token
   */
  setCsrfToken(res: Response): string {
    const token = crypto.randomBytes(256).toString("base64url");

    res.cookie(this.configService.getOrThrow("CSRF_COOKIE_NAME"), token, {
      httpOnly: true,
      sameSite: "strict",
      secure: this.configService.getOrThrow("NODE_ENV") === "production",
    });

    return token;
  }

  /**
   * Main goal of this case
   *
   * @returns persisted movies
   */
  async mainGoal(): Promise<Movie[]> {
    const createdMovies: Movie[] = [];

    const data = await firstValueFrom(
      this.tmdbApiService.discoverMovies({
        sortBy: "primary_release_date.asc",
        "vote_average.gte": "8.4",
        "vote_count.gte": "1500",
        watch_region: "TR",
        with_watch_providers: "8",
      }),
    );

    if (!data || !data.results || data.results.length === 0) {
      return [];
    }

    const dataToBeFetched = data.results.slice(0, 5);

    for (const movie of dataToBeFetched) {
      const movieDetail = await firstValueFrom(
        this.tmdbApiService.getMovieDetails(`${movie.id}`),
      );

      if (!movieDetail) {
        continue;
      }

      const createdMovie = await firstValueFrom(
        this.movieService.createMovie({
          id: movieDetail.id.toString(),
          name: movieDetail.title,
          overview: movieDetail.overview,
          releaseDate: movieDetail.release_date,
          voteAverage: movieDetail.vote_average,
          voteCount: movieDetail.vote_count,
          genres: movieDetail.genres.map((genre: any) => ({
            id: genre.id,
            name: genre.name,
          })),
          popularity: movieDetail.popularity,
        }),
      );

      if (!createdMovie) {
        continue;
      }

      createdMovies.push(createdMovie);
    }

    // console.log(createdMovies);

    return createdMovies.filter((movie) => movie);
  }
}
