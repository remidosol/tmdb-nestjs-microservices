import { Module } from "@nestjs/common";
import { ApiGatewayTmdbApiService } from "./tmdb-api.service";
import { ConfigModule } from "../config/config.module";
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [ApiGatewayTmdbApiService],
  exports: [ApiGatewayTmdbApiService],
})
export class TmdbApiModule {}
