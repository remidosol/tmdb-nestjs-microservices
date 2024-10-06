import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { DateTime } from "luxon";
import { LoggerService } from "../logger/services";

/**
 * Checks whether the key is present in the object and its value is of the given type
 *
 * @param object
 * @param key
 * @param as
 * @returns
 */
export function isKeyPresentAs<TKey extends string, TAs extends "string" | "number" | "boolean">(
  object: unknown,
  key: TKey,
  as: TAs
): object is typeof object & {
  [key in TKey]: TAs extends "string" ? string : TAs extends "number" ? number : boolean;
} {
  return (
    typeof object === "object" &&
    object !== null &&
    key in object &&
    typeof (object as Record<typeof key, unknown>)[key] === as
  );
}

/**
 * Catches error and logs it
 *
 * @param err error object
 * @param logger logger service
 * @returns HttpException
 */
export function catchError(err: any, logger: LoggerService): HttpException {
  if (isKeyPresentAs(err, "status", "number") && isKeyPresentAs(err, "message", "string")) {
    err.status >= 400 && err.status < 500 ? logger.info?.(err.message) : logger.error(err.message);
    return getHttpException(err.status, err.message);
  } else {
    logger.error(err.message, { error: err });
    return new InternalServerErrorException("Something went wrong");
  }
}

/**
 * Gets HTTP exception based on status code
 *
 * @param statusCode
 * @returns
 */
export function getHttpException(statusCode: number, messageOrCustomData?: string | object): HttpException {
  switch (statusCode) {
    case 400:
      return new BadRequestException(messageOrCustomData);
    case 401:
      return new UnauthorizedException(messageOrCustomData);
    case 403:
      return new ForbiddenException(messageOrCustomData);
    case 404:
      return new NotFoundException(messageOrCustomData);
    case 500:
      return new InternalServerErrorException(messageOrCustomData);
    default:
      return new HttpException("A generic error occurred", statusCode);
  }
}

/**
 * Gets ISO Date in given timezone
 *
 * @param date date object
 * @param timeZone timezone string
 * @returns string
 */
export const getISOLocal = (date: Date, timeZone: string): string => {
  return DateTime.fromJSDate(date, {
    zone: timeZone,
  }).toFormat("yyyy-MM-dd'T'HH:mm:ssZZ", { locale: "en" });
};
