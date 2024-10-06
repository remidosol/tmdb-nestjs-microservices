import { ApiPropertyOptional } from "@nestjs/swagger";

export class ApiException {
  @ApiPropertyOptional({ example: 400 }) statusCode?: number;
  @ApiPropertyOptional({ example: "INVALID_ID" }) message?: string;
  // @ApiPropertyOptional() error?: string;
  // @ApiPropertyOptional() errors?: any;
}
