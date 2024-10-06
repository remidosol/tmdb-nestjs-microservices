import { forwardRef, Inject, Injectable } from "@nestjs/common";
import * as winston from "winston";
import { ConfigService } from "../../config/config.service";
import { LoggerService } from "../services";
import { LogData, LogLevel, Logger, LoggerKey, WinstonTransportObject } from "../types";

export const WinstonLoggerTransportsKey = Symbol();

@Injectable()
export class WinstonLogger implements Logger {
  private logger: winston.Logger;
  private syslogLoggers: { logger: winston.Logger }[];

  public constructor(
    @Inject(WinstonLoggerTransportsKey) private transports: WinstonTransportObject,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => LoggerKey)) private readonly loggerService: LoggerService
  ) {
    // Create winston logger
    this.logger = winston.createLogger(this.getLoggerFormatOptions([...transports.transports]));
    this.syslogLoggers = [];
    loggerService.setOrganizationAndContext(WinstonLogger.name);

    // this.logger.info("Winston logger initialized");
  }

  /**
   * Log a message
   * @param level Log level
   * @param message Log message
   * @param data Log data
   * @param profile Log profile
   * 
   * @example
   * ```ts
   * logger.log(LogLevel.Info, "This is a log message", { key: "value" }, "profile");
   * ```
   * 
   * @example
   * ```ts
   * logger.log(LogLevel.Info, new Error("This is an error message"), { key: "value" }, "profile");
   * ```
   * 
   * @example
   * ```json
   * {
        "data": {
          "__v": 0,
          "_id": "65c31da489066b0468946205",
          "action": "READ",
          "app": "App",
          "canCompanySee": true,
          "company": null,
          "context": "Context",
          "createdAt": "2024-02-07T06:05:24.891Z",
          "durationMs": 1,
          "entity": "Program",
          "error": null,
          "label": "Org.Context.App",
          "objectIds": null,
          "organization": "Org",
          "outcome": "SUCCESS",
          "sourceClass": "AuditService",
          "user": "650ab7388182fb74177858c5"
        },
        "level": "info",
        "message": "Audit log created for user 650ab7388182fb74177858c5",
        "timestamp": "07/02/2024, 06:05:24"
    }
    * ```
   */
  public log(level: LogLevel, message: string | Error, data?: LogData, profile?: string) {
    try {
      const logData = {
        level,
        message: message instanceof Error ? message.message : message,
        error: message instanceof Error ? message : undefined,
        ...data,
      };

      if (profile) {
        this.logger.profile(profile, logData);
      } else {
        this.logger.log(logData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Log a message as syslog
   * @param level Log level
   * @param message Log message
   * @param data Log data
   * @param profile Log profile
   * 
   * @example
   * ```ts
   * logger.log(LogLevel.Info, "This is a log message", { key: "value" }, "profile");
   * ```
   * 
   * @example
   * ```ts
   * logger.log(LogLevel.Info, new Error("This is an error message"), { key: "value" }, "profile");
   * ```
   * 
   * @example
   * ```json
   * {
        "data": {
          "__v": 0,
          "_id": "65c31da489066b0468946205",
          "action": "READ",
          "app": "App",
          "canCompanySee": true,
          "company": null,
          "context": "Context",
          "createdAt": "2024-02-07T06:05:24.891Z",
          "durationMs": 1,
          "entity": "Program",
          "error": null,
          "label": "Org.Context.App",
          "objectIds": null,
          "organization": "Org",
          "outcome": "SUCCESS",
          "sourceClass": "AuditService",
          "user": "650ab7388182fb74177858c5"
        },
        "level": "info",
        "message": "Audit log created for user 650ab7388182fb74177858c5",
        "timestamp": "07/02/2024, 06:05:24"
    }
    * ```
   */
  public syslog(level: LogLevel, message: string | Error, data?: LogData) {
    try {
      const logData = {
        level,
        message: message instanceof Error ? message.message : message,
        error: message instanceof Error ? message : undefined,
        ...data,
      };

      this.syslogLoggers.forEach((sysLogger) => {
        sysLogger.logger.log(logData);
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Log a debug message
   *
   * @param message
   * @param data
   * @param profile
   */
  public async debug(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Debug, message, data, profile);
  }

  /**
   * Log an info message
   *
   * @param message
   * @param data
   * @param profile
   */
  public async info(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Info, message, data, profile);
  }

  /**
   * Log an warn message
   *
   * @param message
   * @param data
   * @param profile
   */
  public async warn(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Warn, message, data, profile);
  }

  /**
   * Log an error message
   *
   * @param message
   * @param data
   * @param profile
   */
  public async error(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Error, message, data, profile);
  }

  /**
   * Log an fatal message
   *
   * @param message
   * @param data
   * @param profile
   */
  public async fatal(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Fatal, message, data, profile);
  }

  /**
   * Log an emergency message
   *
   * @param message
   * @param data
   * @param profile
   */
  public async emergency(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Emergency, message, data, profile);
  }

  /**
   * Start a profile
   *
   * @param id
   */
  public startProfile(id: string) {
    this.logger.profile(id);
  }

  /**
   * Get the logger format options
   *
   * @param transports
   * @returns
   */
  private getLoggerFormatOptions(transports: winston.transport[]): winston.LoggerOptions {
    // Setting log levels for winston
    const levels: any = {};
    let cont = 0;
    Object.values(LogLevel).forEach((level) => {
      levels[level] = cont;
      cont++;
    });

    return {
      // level: LogLevel.Debug,
      levels,
      format: winston.format.combine(
        // Add timestamp and format the date
        winston.format.timestamp({
          format: "DD/MM/YYYY, HH:mm:ss",
        }),
        // Errors will be logged with stack trace
        winston.format.errors({ stack: true }),
        // Add custom Log fields to the log
        winston.format((info, _opts) => {
          // Info contains an Error property
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }

          info.label = `${info.organization}.${info.context}.${info.app}`;

          return info;
        })(),
        // Add custom fields to the data property
        winston.format.metadata({
          key: "data",
          fillExcept: ["timestamp", "level", "message"],
        }),
        // Format the log as JSON
        winston.format.json()
      ),
      transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }
}
