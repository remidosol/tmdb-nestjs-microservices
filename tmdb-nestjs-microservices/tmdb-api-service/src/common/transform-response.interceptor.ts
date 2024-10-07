import {
  BadRequestException,
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  HttpException,
  PlainLiteralObject,
  Type,
} from "@nestjs/common";
import { Response } from "express";
import { Observable, of, onErrorResumeNext } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { KafkaContext, RpcException } from "@nestjs/microservices";
import { ClassTransformOptions, plainToClass } from "class-transformer";

export type SerializedResponse =
  | (PlainLiteralObject | object)
  | (PlainLiteralObject | object)[];

/**
 * A class serializer interceptor that converts plain objects to class instances.
 *
 * @param classToIntercept The class to convert the plain object to.
 * @returns {ClassSerializerInterceptor} The class serializer interceptor.
 */
export function CustomClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      return plainToClass(
        classToIntercept,
        JSON.parse(JSON.stringify(document)),
      );
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}

export function TransformResponseInterceptor(
  classToSerialize: Type,
): typeof ClassSerializerInterceptor {
  const CustomSerializer = CustomClassSerializerInterceptor(classToSerialize);

  return class TransformInterceptor extends CustomSerializer {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<SerializedResponse | object | string | null> {
      const response = context.switchToRpc().getContext<KafkaContext>();

      return next.handle().pipe(
        catchError((err, caught) => {
          if (err) return onErrorResumeNext(of(err));

          return caught;
        }),
        map((data) => {
          console.log(data);
          if (data === null || data === undefined) {
            return null;
          } else if (data.message) {
            const dataWithType = data as HttpException;
            return dataWithType.getResponse();
          } else if (typeof data === "string") {
            return data;
          } else if (
            (Array.isArray(data) && data.length === 0) ||
            (Array.isArray(data.data) && data.data.length === 0)
          ) {
            return [];
          }

          // console.log("data", data);
          const serializedData = this.serialize(data, this.defaultOptions);

          return serializedData;
        }),
      );
    }
  };
}
