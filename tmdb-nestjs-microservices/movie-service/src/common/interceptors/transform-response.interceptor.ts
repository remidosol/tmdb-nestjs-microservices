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
import { MongooseClassSerializerInterceptor } from "../mongo/mongoose.serializer";
import { KafkaContext, RpcException } from "@nestjs/microservices";

export type SerializedResponse =
  | (PlainLiteralObject | object)
  | (PlainLiteralObject | object)[];

export function TransformResponseInterceptor(
  classToSerialize: Type,
): typeof ClassSerializerInterceptor {
  const MongooseSerializer =
    MongooseClassSerializerInterceptor(classToSerialize);

  return class TransformInterceptor extends MongooseSerializer {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<SerializedResponse | object | string | null> {
      const response = context.switchToRpc().getContext<KafkaContext>();
      // console.log(context.getType());
      // console.log(response.getMessage());
      // console.log(response.getTopic());

      return next.handle().pipe(
        catchError((err, caught) => {
          // console.log(JSON.stringify(err, null, 2));
          // console.log(caught);
          // console.log(response.getMessage());

          if (err) return onErrorResumeNext(of(err));

          return caught;
        }),
        map((data) => {
          // console.log(data);
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
