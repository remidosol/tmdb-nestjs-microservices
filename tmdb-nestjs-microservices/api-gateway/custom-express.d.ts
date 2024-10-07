import "express";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
    responseTime?: string;
  }
}
