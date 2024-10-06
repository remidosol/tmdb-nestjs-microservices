import { Module } from "@nestjs/common";
import { SyslogTransportInstance } from "winston-syslog";
import { ConsoleTransportInstance } from "winston/lib/winston/transports";
import { ConfigService } from "../config/config.service";
import NestjsLoggerServiceAdapter from "./logger.adapter";
import { LoggerService } from "./services";
import { LoggerBaseKey, LoggerKey, WinstonTransportObject } from "./types";
import { ConsoleTransport } from "./winston/transports";
import { WinstonLogger, WinstonLoggerTransportsKey } from "./winston/winston.logger";

@Module({
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: NestjsLoggerServiceAdapter,
      useFactory: (logger: LoggerService) => new NestjsLoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: async (configService: ConfigService): Promise<WinstonTransportObject> => {
        const transports = [];

        transports.push(ConsoleTransport.createColorize());
        // transports.push(FileTransport.create());

        // if (
        //   configService.get("SYSLOG_SERVER_HOST") &&
        //   configService.get("SYSLOG_SERVER_PORT") &&
        //   configService.get("SYSLOG_PROTOCOL") &&
        //   configService.get("SYSLOG_FACILITY")
        // ) {
        //   transports.push(
        //     SysLogTransport.create({
        //       host: configService.getOrThrow("SYSLOG_SERVER_HOST"),
        //       port: +configService.getOrThrow("SYSLOG_SERVER_PORT"),
        //       app_name: configService.getOrThrow("APP_NAME"),
        //       protocol: configService.getOrThrow("SYSLOG_PROTOCOL"),
        //       facility: configService.getOrThrow("SYSLOG_FACILITY"),
        //     })
        //   );
        // }

        return {
          transports: transports.filter((transport) => transport) as (
            | ConsoleTransportInstance
            | SyslogTransportInstance
          )[],
          syslogTransports: [],
        };
      },
      inject: [ConfigService],
    },
  ],
  exports: [LoggerKey, NestjsLoggerServiceAdapter],
})
export class LoggerModule {}
