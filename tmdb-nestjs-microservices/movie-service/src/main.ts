import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import mongoose from "mongoose";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { LoggerKey } from "./logger/types";
import { Logger } from "@nestjs/common";
import { Partitioners } from "kafkajs";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const configService = appContext.get(ConfigService);
  const logger = await appContext.resolve(LoggerKey);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        producer: { createPartitioner: Partitioners.LegacyPartitioner },
        client: {
          clientId: "movie-service",
          brokers: [
            configService.getOrThrow<string>("KAFKA_BROKER", "kafka:29092"),
          ],
          // logLevel: logLevel.DEBUG,
        },
        consumer: {
          groupId: "movie-service-consumer",
        },
      },
    },
  );

  mongoose.set("debug", configService.getOrThrow("DEBUG") === "true");

  await app.listen();

  logger.info("Movie Service is running", {
    sourceClass: "Main",
    sourceMethod: "bootstrap",
  });
}

bootstrap().catch((error) => {
  new Logger("MOVIE_SERVICE").error(error.message, error);
  process.exit(1);
});
