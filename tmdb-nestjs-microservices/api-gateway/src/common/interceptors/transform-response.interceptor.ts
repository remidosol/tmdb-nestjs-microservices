import { CallHandler, ClassSerializerInterceptor, ExecutionContext, PlainLiteralObject, Type } from "@nestjs/common";
import { ClassTransformOptions, plainToClass } from "class-transformer";
import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface SerializedResponse {
  statusCode: number;
  data: (PlainLiteralObject | object) | (PlainLiteralObject | object)[];
}

/**
 * A class serializer interceptor that converts plain objects to class instances.
 *
 * @param classToIntercept The class to convert the plain object to.
 * @returns {ClassSerializerInterceptor} The class serializer interceptor.
 */
export function CustomClassSerializerInterceptor(classToIntercept: Type): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      return plainToClass(classToIntercept, JSON.parse(JSON.stringify(document)));
    }

    private prepareResponse(response: PlainLiteralObject | PlainLiteralObject[]) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(response: PlainLiteralObject | PlainLiteralObject[], options: ClassTransformOptions) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}

export function TransformResponseInterceptor(classToSerialize: Type): typeof ClassSerializerInterceptor {
  const CustomSerializer = CustomClassSerializerInterceptor(classToSerialize);

  return class TransformInterceptor extends CustomSerializer {
    intercept(context: ExecutionContext, next: CallHandler): Observable<SerializedResponse | object> {
      const response = context.switchToHttp().getResponse<Response<typeof classToSerialize>>();

      return next.handle().pipe(
        map((data) => {
          //   console.log(data);
          if (data === null || data === undefined) {
            return {
              statusCode: response.statusCode,
              data: null,
            };
          } else if (data.statusCode && data.message && data.error) {
            return data;
          } else if (typeof data === "string") {
            let manipulatedData = data;

            try {
              manipulatedData = JSON.parse(data);

              return {
                statusCode: response.statusCode,
                data: manipulatedData,
              };
            } catch (err) {
              return {
                statusCode: response.statusCode,
                message: data,
              };
            }
          } else if (
            (Array.isArray(data) && data.length === 0) ||
            (Array.isArray(data.data) && data.data.length === 0)
          ) {
            return {
              statusCode: response.statusCode,
              data: [],
            };
          }

          // console.log("data", data);
          const serializedData = this.serialize(data, this.defaultOptions);

          const responseBody: SerializedResponse = {
            statusCode: response.statusCode,
            data: serializedData,
          };

          return responseBody;
        })
      );
    }
  };
}
