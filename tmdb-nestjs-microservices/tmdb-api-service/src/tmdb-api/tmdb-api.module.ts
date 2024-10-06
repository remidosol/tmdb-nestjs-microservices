import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { LoggerModule } from "../logger/logger.module";
import { TmdbApiController } from "./tmdb-api.controller";
import { TmdbApiService } from "./tmdb-api.service";

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [TmdbApiController],
  providers: [TmdbApiService],
})
export class TmdbApiModule {}
