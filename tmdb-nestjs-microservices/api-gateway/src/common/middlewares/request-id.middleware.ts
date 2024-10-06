import { v4 as uuidv4 } from "uuid";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private generateV4UUID = (_request: Request) => {
    return uuidv4();
  };

  use(req: Request, res: Response, next: () => void) {
    const headerName = "X-Request-Id";

    const oldValue = req.get(headerName);
    const id = oldValue ?? this.generateV4UUID(req);

    res.set(headerName, id);

    req.requestId = id;

    next();
  }
}
