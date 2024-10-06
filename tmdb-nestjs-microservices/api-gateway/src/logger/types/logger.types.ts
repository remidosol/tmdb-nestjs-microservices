import { SyslogTransportInstance } from "winston-syslog";
import { ConsoleTransportInstance } from "winston/lib/winston/transports";
import { LogData, LogLevel } from "./log.types";

export const LoggerBaseKey = Symbol();
export const LoggerKey = Symbol();

export interface Logger {
  log(level: LogLevel, message: string | Error, data?: LogData, profile?: string): void;
  syslog(level: LogLevel, message: string | Error, data?: LogData): void;
  debug(message: string, data?: LogData, profile?: string): void;
  info(message: string, data?: LogData, profile?: string): void;
  warn(message: string | Error, data?: LogData, profile?: string): void;
  error(message: string | Error, data?: LogData, profile?: string): void;
  fatal(message: string | Error, data?: LogData, profile?: string): void;
  emergency(message: string | Error, data?: LogData, profile?: string): void;
  startProfile(id: string): void;
}

export type WinstonTransportObject = {
  transports: (ConsoleTransportInstance | SyslogTransportInstance)[];
  syslogTransports: { instance: SyslogTransportInstance }[];
};

export enum WinstonLoggerEventType {
  initSyslogConfigs = "init.syslog.configs",
}
