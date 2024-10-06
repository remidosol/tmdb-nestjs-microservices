import { Module } from "@nestjs/common";
import { ApiGatewayMovieController } from "./movie.controller";
import { ApiGatewayMovieService } from "./movie.service";
import { ConfigModule } from "../config/config.module";
import { LoggerModule } from "../logger/logger.module";
// import { MOVIE_SERVICE } from "./movie.types";

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [ApiGatewayMovieController],
  providers: [ApiGatewayMovieService],
  exports: [ApiGatewayMovieService],
})
export class MovieModule {}
