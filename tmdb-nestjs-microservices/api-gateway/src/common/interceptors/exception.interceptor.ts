import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ValidationErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (err, caught) => {
        if (err.response?.statusCode === 400) {
          if (Array.isArray(err.response.message)) {
            throw new BadRequestException(err.response.message[0]).getResponse();
          }

          throw new BadRequestException(err.response.message).getResponse();
        }

        return caught;
      })
    );
  }
}
