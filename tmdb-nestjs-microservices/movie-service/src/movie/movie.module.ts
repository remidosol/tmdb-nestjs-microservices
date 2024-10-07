import { Inject, MiddlewareConsumer, Module } from "@nestjs/common";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieRepository } from "./movie.repository";
import { MovieSchemaProvider } from "./movie.provider";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { LoggerModule } from "../logger/logger.module";
import { LoggerService } from "../logger/services";
import { LoggerKey } from "../logger/types";
import morgan from "morgan";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.getOrThrow<string>("DATABASE_URL"),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeatureAsync([MovieSchemaProvider]),
    ConfigModule,
    LoggerModule,
  ],
  providers: [MovieService, MovieRepository],
  controllers: [MovieController],
})
export class MovieModule {}
