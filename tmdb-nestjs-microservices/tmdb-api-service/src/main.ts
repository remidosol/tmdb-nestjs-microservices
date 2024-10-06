import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { JsonAndStringDeserializer, JsonAndStringSerializer } from "./common";
import { LoggerKey } from "./logger/types";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { Partitioners } from "kafkajs";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const configService = appContext.get(ConfigService);
  const logger = await appContext.resolve(LoggerKey);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      producer: { createPartitioner: Partitioners.LegacyPartitioner },
      client: {
        clientId: "tmdb-api-service",
        brokers: [configService.getOrThrow<string>("KAFKA_BROKER", "kafka:29092")],
        // logLevel: logLevel.DEBUG,
      },
      consumer: {
        groupId: "tmdb-api-service-consumer",
      },
    },
  });

  await app.listen();

  logger.info("TMDB API Service is running", {
    sourceClass: "Main",
    sourceMethod: "bootstrap",
  });
}

bootstrap().catch((error) => {
  new Logger("TMDB_API_SERVICE").error(error.message, error);
  process.exit(1);
});
