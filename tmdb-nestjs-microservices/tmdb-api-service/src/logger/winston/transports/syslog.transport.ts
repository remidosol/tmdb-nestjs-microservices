import { Syslog, SyslogTransportOptions, SyslogTransportInstance } from "winston-syslog";

export class SysLogTransport {
  public static create(options: SyslogTransportOptions): SyslogTransportInstance | undefined {
    const sysLog = new Syslog(options);

    try {
      sysLog.connect((err: any) => {
        if (err) {
          console.error(`Syslog connection error: ${err.message}`);
        } else {
          console.log(`Syslog connection established`);
        }
      });

      return sysLog;
    } catch (err: any) {
      console.error(`Syslog connection error: ${err.message}`);
    }
  }
}
