import { IsString, IsIn, ValidateIf } from "class-validator";
import { FilterCustomValidationMessageKeys } from "./filter.constants";

export type OrderQuery<T> = { [key in keyof Partial<T>]: 1 | -1 };

export class OrderDto {
  @ValidateIf((dto: OrderDto) => dto.order !== null && dto.order !== undefined)
  @IsString()
  field?: string;

  @ValidateIf((dto: OrderDto) => dto.field !== null && dto.field !== undefined)
  @IsString()
  @IsIn(["asc", "desc"], {
    message: FilterCustomValidationMessageKeys.PROVIDE_VALID_ORDER_TYPE,
  })
  order?: "asc" | "desc";
}
