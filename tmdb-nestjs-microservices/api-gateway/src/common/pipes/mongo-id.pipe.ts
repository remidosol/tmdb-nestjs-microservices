import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from "@nestjs/common";
import { isMongoId } from "class-validator";

/**
 * To validate id strings
 *
 * @class GlobalMongoIdValidator
 * @constructor validationOptions (have to contain the both of fileType and maxSize)
 */
export class GlobalMongoIdValidator {
  buildErrorMessage(): string {
    return `You should provide a valid id!`;
  }

  async isValid(mongoId: string): Promise<boolean> {
    return isMongoId(mongoId);
  }
}

@Injectable()
export class MongoIdValidationPipe implements PipeTransform<string> {
  protected exceptionThrower: (error: string, status: HttpStatus) => HttpException;

  private isRequired: boolean;

  private readonly validator: GlobalMongoIdValidator;

  constructor(isRequired = false) {
    this.exceptionThrower = (error: string, status: HttpStatus) => new HttpException(error, status);

    this.validator = new GlobalMongoIdValidator();
    this.isRequired = isRequired;
  }

  /**
   * Main function of Pipe to validate mongoId
   *
   * @param mongoId the mongoId must be validated
   * @param _metadata
   * @returns mongoId
   */
  async transform(mongoId: string | undefined, _metadata?: ArgumentMetadata) {
    if (this.isRequired) {
      if (mongoId) {
        await this.validate(mongoId);

        return mongoId;
      } else {
        throw this.exceptionThrower("Id is required!", HttpStatus.BAD_REQUEST);
      }
    }

    return undefined;
  }

  /**
   *
   * To validate mongoId.
   *
   * @param mongoId the mongoId must be validated
   * @returns mongoId
   */
  protected async validate(mongoId: string): Promise<string> {
    await this.validateOrThrow(mongoId);

    return mongoId;
  }

  /**
   * To validate mongoId
   *
   * @param mongoId the mongoId must be validated
   * @returns When the mongoId not valid, it throws an Http Exception
   */
  private async validateOrThrow(mongoId: string) {
    const isValid = await this.validator.isValid(mongoId);

    if (!isValid) {
      const errorMessage = this.validator.buildErrorMessage();
      throw this.exceptionThrower(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
