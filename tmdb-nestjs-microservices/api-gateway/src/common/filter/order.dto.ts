import { ApiProperty, ApiQueryOptions, getSchemaPath } from "@nestjs/swagger";
import { IsString, IsIn, ValidateIf } from "class-validator";
import { FilterCustomValidationMessageKeys } from "./filter.constants";

export type OrderQuery<T> = { [key in keyof Partial<T>]: 1 | -1 };

export class OrderDto {
  @ValidateIf((dto: OrderDto) => dto.order !== null && dto.order !== undefined)
  @IsString()
  @ApiProperty({
    description: "Field to order by",
    required: true,
    examples: ["name", "id"],
  })
  field?: string;

  @ValidateIf((dto: OrderDto) => dto.field !== null && dto.field !== undefined)
  @IsString()
  @IsIn(["asc", "desc"], { message: FilterCustomValidationMessageKeys.PROVIDE_VALID_ORDER_TYPE })
  @ApiProperty({
    description: "Order type",
    enum: ["asc", "desc"],
    required: true,
    examples: ["asc", "desc"],
  })
  order?: "asc" | "desc";
}

export const orderRequestQuery: ApiQueryOptions = {
  type: "object",
  description: `Order order related entity, all fields are required when using this query parameter object.`,
  name: "orderBy",
  required: false,
  style: "deepObject",
  explode: true,
  schema: {
    $ref: getSchemaPath(OrderDto),
  },
  examples: {
    orderBy: {
      description: `Request URL(Decoded) example: "http://localhost:3333/api/{related entity}?orderBy[field]=createdAt&orderBy[order]=desc"`,
      value: {
        field: "id",
        order: "desc",
      },
    },
  },
};
