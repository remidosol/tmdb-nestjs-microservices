export enum LogLevel {
  Emergency = "emergency", // One or more systems are unusable.
  Fatal = "fatal", // A person must take an action immediately
  Error = "error", // Error events are likely to cause problems
  Warn = "warn", // Warning events might cause problems in the future and deserve eyes
  Info = "info", // Routine information, such as ongoing status or performance
  Debug = "debug", // Debug or trace information
}

export interface LogData {
  organization?: string; // Organization or project name
  context?: string; // Bounded Context name
  app?: string; // Application or Microservice name
  sourceClass?: string; // Classname of the source
  correlationId?: string; // Correlation ID
  error?: Error; // Error object
  props?: NodeJS.Dict<any>; // Additional custom properties
  companyIds?: string[]; // Company ID
}

export interface Log {
  timestamp: number; // Unix timestamp
  level: LogLevel; // Log level
  message: string; // Log message
  data: LogData; // Log data
}

export type SyslogType = "BSD" | "3164" | "5424" | "RFC3164" | "RFC5424";

export enum SyslogTypeEnum {
  BSD = "BSD",
  RFC3164 = "RFC3164",
  RFC5424 = "RFC5424",
}

export type SyslogProtocol =
  | "tcp"
  | "tcp4"
  | "tcp6"
  | "udp"
  | "udp4"
  | "udp6"
  | "tls"
  | "tls4"
  | "tls6"
  | "unix"
  | "unix-connect";

export enum SyslogProtocolEnum {
  TCP = "tcp",
  TCP4 = "tcp4",
  TCP6 = "tcp6",
  UDP = "udp",
  UDP4 = "udp4",
  UDP6 = "udp6",
  TLS = "tls",
  TLS4 = "tls4",
  TLS6 = "tls6",
  UNIX = "unix",
  UNIX_CONNECT = "unix-connect",
}

export type SyslogFacility =
  | "kernel"
  | "user"
  | "mail"
  | "daemon"
  | "auth"
  | "syslog"
  | "lpr"
  | "news"
  | "uucp"
  | "cron"
  | "authpriv"
  | "ftp"
  | "ntp"
  | "security"
  | "console"
  | "solaris-cron"
  | "local0"
  | "local1"
  | "local2"
  | "local3"
  | "local4"
  | "local5"
  | "local6"
  | "local7";

export enum SyslogFacilityEnum {
  KERNEL = "kernel",
  USER = "user",
  MAIL = "mail",
  DAEMON = "daemon",
  AUTH = "auth",
  SYSLOG = "syslog",
  LPR = "lpr",
  NEWS = "news",
  UUCP = "uucp",
  CRON = "cron",
  AUTHPRIV = "authpriv",
  FTP = "ftp",
  NTP = "ntp",
  SECURITY = "security",
  CONSOLE = "console",
  SOLARIS_CRON = "solaris-cron",
  LOCAL0 = "local0",
  LOCAL1 = "local1",
  LOCAL2 = "local2",
  LOCAL3 = "local3",
  LOCAL4 = "local4",
  LOCAL5 = "local5",
  LOCAL6 = "local6",
  LOCAL7 = "local7",
}
