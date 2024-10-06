import { Inject, MiddlewareConsumer, Module } from "@nestjs/common";
import morgan from "morgan";
import { TmdbApiModule } from "./tmdb-api/tmdb-api.module";
import { LoggerService } from "./logger/services";
import { ConfigService } from "./config/config.service";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "./logger/logger.module";
import { LoggerKey } from "./logger/types";

@Module({
  imports: [ConfigModule, LoggerModule, TmdbApiModule],
})
export class AppModule {
  public constructor(
    private configService: ConfigService,
    @Inject(LoggerKey) private logger: LoggerService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        morgan(this.configService.isProduction ? "combined" : "dev", {
          stream: {
            write: (message: string) => {
              this.logger.info(message, {
                sourceClass: "RequestLogger",
                app: this.configService.getOrThrow("APP_NAME"),
                context: "Global-HTTP",
                organization: "TMDB API Gateway",
              });
            },
          },
        })
      )
      .forRoutes("*");
  }
}
