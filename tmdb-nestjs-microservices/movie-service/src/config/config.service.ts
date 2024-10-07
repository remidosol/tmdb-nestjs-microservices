import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./config.entity";

@Injectable()
export class ConfigService extends NestConfigService<EnvironmentVariables> {
  get isProduction(): boolean {
    return this.environment === "production";
  }

  get isDevelopment(): boolean {
    return this.environment === "development";
  }

  get isTest(): boolean {
    return this.environment === "test";
  }

  private get environment(): string {
    return this.getOrThrow("NODE_ENV");
  }
}
