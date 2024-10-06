import { Logger } from "@apollo/utils.logger";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Inject, MiddlewareConsumer, Module, Logger as NestLogger } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ThrottlerModule } from "@nestjs/throttler";
import morgan from "morgan";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CsrfMiddleware, RequestIdMiddleware } from "./common/middlewares";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { LoggerModule } from "./logger/logger.module";
import { LoggerService } from "./logger/services";
import { LoggerKey } from "./logger/types";
import { MovieModule } from "./movie/movie.module";
import { TmdbApiModule } from "./tmdb-api/tmdb-api.module";
import { MOVIE_SERVICE } from "./movie/movie.types";
import { TMDB_API_SERVICE } from "./tmdb-api/types";
import { Partitioners } from "kafkajs";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          imports: [ConfigModule],
          name: MOVIE_SERVICE,
          useFactory(configService: ConfigService) {
            return {
              transport: Transport.KAFKA,
              options: {
                producer: { createPartitioner: Partitioners.LegacyPartitioner },
                client: {
                  clientId: "api-gateway-movie",
                  brokers: [configService.getOrThrow<string>("KAFKA_BROKER", "kafka:29092")],
                },
                consumer: {
                  groupId: "api-gateway-movie-consumer",
                },
              },
            };
          },
          inject: [ConfigService],
        },
        {
          imports: [ConfigModule],
          name: TMDB_API_SERVICE,
          useFactory(configService: ConfigService) {
            return {
              transport: Transport.KAFKA,
              options: {
                producer: { createPartitioner: Partitioners.LegacyPartitioner },
                client: {
                  clientId: "api-gateway-tmdb-api",
                  brokers: [configService.getOrThrow<string>("KAFKA_BROKER", "kafka:29092")],
                },
                consumer: {
                  groupId: "api-gateway-tmdb-api-consumer",
                },
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
    MovieModule,
    TmdbApiModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        const getApolloLogger = () => {
          const logger = new NestLogger("GraphQL");

          const apolloLogger: Logger = {
            debug: logger.debug,
            info: logger.log,
            warn: logger.warn,
            error: logger.error,
          };

          return apolloLogger;
        };

        return {
          playground: true,
          logger: getApolloLogger(),
          typePaths: ["./**/*.graphql"],
          definitions: {
            path: join(process.cwd(), "src/graphql.ts"),
            outputAs: "interface",
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: "default",
            ttl: +configService.getOrThrow("DEFAULT_THROTTLE_TTL"),
            limit: +configService.getOrThrow("DEFAULT_THROTTLE_LIMIT"),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public constructor(
    private configService: ConfigService,
    @Inject(LoggerKey) private logger: LoggerService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");

    consumer.apply(CsrfMiddleware).exclude("/csrf").forRoutes("*");

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
