import {
  Global,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { Request, Response } from "express";

@Global()
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: () => void) {
    const cookieCsrf =
      req.cookies[this.configService.getOrThrow<string>("CSRF_COOKIE_NAME")];
    const headerCsrf =
      req.headers[this.configService.getOrThrow<string>("CSRF_HEADER_NAME")];

    if (!cookieCsrf && !headerCsrf) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: "CSRF cookie and header not found!",
      });
    } else if (!cookieCsrf) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: "CSRF cookie not found!",
      });
    } else if (!headerCsrf) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: "CSRF header not found!",
      });
    } else if (cookieCsrf !== headerCsrf) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: "Invalid CSRF token!",
      });
    }

    return next();
  }
}
