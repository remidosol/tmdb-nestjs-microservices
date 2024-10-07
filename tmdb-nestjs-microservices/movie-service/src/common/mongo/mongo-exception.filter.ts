import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { KafkaContext } from "@nestjs/microservices";
import { Response } from "express";
import { MongoError } from "mongodb";

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter<MongoError> {
  private logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const response = ctx.getData();

    console.log(ctx.getContext<KafkaContext>().getMessage());

    this.logger.error(exception.message, { error: exception });

    console.error(exception);
    console.error(JSON.stringify(exception, null, 2));

    return {
      statusCode: 500,
      message: "Something went wrong!",
    };
  }
}
