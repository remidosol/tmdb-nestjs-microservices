import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { Reflector } from "@nestjs/core";
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from "@nestjs/throttler";
import { Request } from "express";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected errorMessage = "Too Many Requests";
  private logger = new Logger(CustomThrottlerGuard.name);

  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(options, storageService, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    switch (req.method) {
      case "POST": {
        this.throttlers = [
          {
            name: "Post-Throttler",
            ttl: +this.configService.getOrThrow("POST_PATCH_THROTTLE_TTL"),
            limit: +this.configService.getOrThrow("POST_PATCH_THROTTLE_LIMIT"),
          },
        ];
        break;
      }

      case "PATCH": {
        this.throttlers = [
          {
            name: "Patch-Throttler",
            ttl: +this.configService.getOrThrow("POST_PATCH_THROTTLE_TTL"),
            limit: +this.configService.getOrThrow("POST_PATCH_THROTTLE_LIMIT"),
          },
        ];
        break;
      }

      default: {
        this.throttlers = [
          {
            name: "Default",
            ttl: +this.configService.getOrThrow("DEFAULT_THROTTLE_TTL"),
            limit: +this.configService.getOrThrow("DEFAULT_THROTTLE_LIMIT"),
          },
        ];
        break;
      }
    }

    const superResult = await super.canActivate(context);

    return superResult;
  }
}
