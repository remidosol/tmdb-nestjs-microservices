import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { CustomThrottlerGuard } from "./common/guards";
import { ApiCookieAuth, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { findAllResponse } from "./movie/movie.swagger";
import { TransformResponseInterceptor } from "./common/interceptors";
import { Movie } from "./movie/movie.types";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/csrf")
  @UseGuards(CustomThrottlerGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransformResponseInterceptor(Object))
  csrf(@Res({ passthrough: true }) res: Response) {
    return { csrfToken: this.appService.setCsrfToken(res) };
  }

  @Get("/main_goal")
  @UseGuards(CustomThrottlerGuard)
  @ApiCookieAuth()
  @ApiResponse(findAllResponse)
  @ApiSecurity({ "x-tmdb-nestjs-csrf": [] })
  @UseInterceptors(TransformResponseInterceptor(Movie))
  mainGoal() {
    return this.appService.mainGoal();
  }
}
