import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { BadRequestExceptionMessageKeys } from "../../common/error-message";

export class GenreDto {
  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_ID })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER })
  @ApiProperty({
    type: Number,
    example: 55,
    required: true,
  })
  id!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_GENRE_NAME })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  @MaxLength(25, { message: BadRequestExceptionMessageKeys.GENRE_NAME_LENGTH_EXCEEDED })
  @ApiProperty({
    type: String,
    example: "Crime",
    required: true,
  })
  name!: string;
}

export class CreateMovieDto {
  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_ID })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  @ApiProperty({
    type: String,
    example: "55",
    required: true,
  })
  id!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_MOVIE_NAME })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  @MaxLength(25, { message: BadRequestExceptionMessageKeys.MOVIE_NAME_LENGTH_EXCEEDED })
  @ApiProperty({
    type: String,
    example: "The Godfather",
    required: true,
  })
  name!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_OVERVIEW })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  @MaxLength(250, { message: BadRequestExceptionMessageKeys.OVERVIEW_LENGTH_EXCEEDED })
  @ApiProperty({
    type: String,
    example: "Overview of the movie.",
    required: true,
  })
  overview!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_POPULARITY })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER })
  @Max(100.0, { message: BadRequestExceptionMessageKeys.POPULARITY_MAX_VALUE_EXCEEDED })
  @Min(0.0, { message: BadRequestExceptionMessageKeys.POPULARITY_MIN_VALUE_EXCEEDED })
  @ApiProperty({
    type: Number,
    example: 73.545,
    required: true,
  })
  popularity!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_VOTE_AVERAGE })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER })
  @Max(10.0, { message: BadRequestExceptionMessageKeys.VOTE_AVERAGE_MAX_VALUE_EXCEEDED })
  @Min(0.0, { message: BadRequestExceptionMessageKeys.VOTE_AVERAGE_MIN_VALUE_EXCEEDED })
  @ApiProperty({
    type: Number,
    example: 8.4,
    required: true,
  })
  voteAverage!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_VOTE_COUNT })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER })
  @ApiProperty({
    type: Number,
    example: 1500,
    required: true,
  })
  voteCount!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_RELEASE_DATE })
  @IsDateString(undefined, { message: BadRequestExceptionMessageKeys.INVALID_DATE_PROVIDED })
  @ApiProperty({
    type: String,
    required: true,
    example: "2023-06-21",
  })
  releaseDate!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_GENRES })
  @IsArray({ message: BadRequestExceptionMessageKeys.PROVIDE_ARRAY })
  @Type(() => GenreDto)
  @ValidateNested({ each: true, message: BadRequestExceptionMessageKeys.PROVIDE_VALID_GENRE_OBJECTS })
  @ApiProperty({
    description: "An array of genres.",
    type: [GenreDto],
    required: true,
  })
  genres!: GenreDto[];
}
