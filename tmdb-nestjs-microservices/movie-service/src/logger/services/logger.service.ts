import { Inject, Injectable, Scope } from "@nestjs/common";
import { INQUIRER } from "@nestjs/core";
import { ConfigService } from "../../config/config.service";
import { LogData, LogLevel, Logger, LoggerBaseKey } from "../types";
import { WinstonLogger } from "../winston/winston.logger";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements Logger {
  private sourceClass: string;
  private organization: string;
  private context: string;
  private app: string;

  public constructor(
    @Inject(LoggerBaseKey) private logger: WinstonLogger,
    configService: ConfigService,
    @Inject(INQUIRER) parentClass: object,
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name;

    // Set the organization, context and app from the environment variables
    this.organization = "NestJS Movie Microservice";
    this.context = "Log";
    this.app = configService.getOrThrow("APP_NAME");
  }

  public setOrganizationAndContext(context?: string, organization?: string) {
    if (organization) {
      this.organization = organization;
    }

    if (context) {
      this.context = context;
    }
  }

  /**
   * Log a message
   *
   * @param level LogLevel
   * @param message
   * @param data
   * @param profile
   */
  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  /**
   * Log a message as syslog
   *
   * @param level LogLevel
   * @param message
   * @param data
   * @param profile
   */
  public syslog(level: LogLevel, message: string | Error, data?: LogData) {
    return this.logger.syslog(level, message, this.getLogData(data));
  }

  /**
   * Log a debug message
   *
   * @param message
   * @param data
   * @param profile
   */
  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  /**
   * Log an info message
   *
   * @param message
   * @param data
   * @param profile
   */
  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  /**
   * Log a warn message
   *
   * @param message
   * @param data
   * @param profile
   */
  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  /**
   * Log an error message
   *
   * @param message
   * @param data
   * @param profile
   */
  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  /**
   * Log a critical message
   *
   * @param message
   * @param data
   * @param profile
   */
  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  /**
   * Log an alert message
   *
   * @param message
   * @param data
   * @param profile
   */
  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      organization: data?.organization || this.organization,
      context: data?.context || this.context,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
      //   correlationId: data?.correlationId || this.contextStorageService.getContextId(),
    };
  }

  public startProfile(id: string) {
    this.logger.startProfile(id);
  }
}
