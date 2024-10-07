import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export class EnvironmentVariables {
  HOST!: string;
  HOST_BASE_URL!: string;
  DOCKER_HOST_BASE_URL!: string;
  PORT!: string;
  MOVIE_SERVICE_PORT!: string;
  TMDB_API_SERVICE_PORT!: string;
  KAFKA_BROKER!: string;
  NODE_ENV!: "development" | "production";
  DEBUG!: "true" | "false";
  APP_NAME!: string;

  // CSRF
  CSRF_COOKIE_NAME!: string;
  CSRF_HEADER_NAME!: string;

  // THROTTLER
  DEFAULT_THROTTLE_TTL!: string;
  DEFAULT_THROTTLE_LIMIT!: string;
  POST_PATCH_THROTTLE_TTL!: string;
  POST_PATCH_THROTTLE_LIMIT!: string;

  constructor() {
    validate(process.env);
    Object.assign(this, process.env);
  }
}

export function validate(processEnv: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, processEnv, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: true,
    skipUndefinedProperties: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
