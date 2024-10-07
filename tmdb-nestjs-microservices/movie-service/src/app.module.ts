import { Inject, MiddlewareConsumer, Module } from "@nestjs/common";
import morgan from "morgan";
import { ConfigService } from "./config/config.service";
import { LoggerService } from "./logger/services";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "./logger/logger.module";
import { LoggerKey } from "./logger/types";
import { MovieModule } from "./movie/movie.module";

@Module({
  imports: [ConfigModule, LoggerModule, MovieModule],
})
export class AppModule {
  public constructor(
    private configService: ConfigService,
    @Inject(LoggerKey) private logger: LoggerService,
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
        }),
      )
      .forRoutes("*");
  }
}
