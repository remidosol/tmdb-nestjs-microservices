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
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER },
  )
  id!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_GENRE_NAME })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  @MaxLength(25, {
    message: BadRequestExceptionMessageKeys.GENRE_NAME_LENGTH_EXCEEDED,
  })
  name!: string;
}

export class CreateMovieDto {
  constructor(data?: Partial<CreateMovieDto>) {
    Object.assign(this, data);
  }

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_ID })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  id!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_MOVIE_NAME })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  @MaxLength(25, {
    message: BadRequestExceptionMessageKeys.MOVIE_NAME_LENGTH_EXCEEDED,
  })
  name!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_OVERVIEW })
  @IsString({ message: BadRequestExceptionMessageKeys.PROVIDE_STRING })
  @MaxLength(250, {
    message: BadRequestExceptionMessageKeys.OVERVIEW_LENGTH_EXCEEDED,
  })
  overview!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_POPULARITY })
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER },
  )
  @Max(100.0, {
    message: BadRequestExceptionMessageKeys.POPULARITY_MAX_VALUE_EXCEEDED,
  })
  @Min(0.0, {
    message: BadRequestExceptionMessageKeys.POPULARITY_MIN_VALUE_EXCEEDED,
  })
  popularity!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_VOTE_AVERAGE })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER },
  )
  @Max(10.0, {
    message: BadRequestExceptionMessageKeys.VOTE_AVERAGE_MAX_VALUE_EXCEEDED,
  })
  @Min(0.0, {
    message: BadRequestExceptionMessageKeys.VOTE_AVERAGE_MIN_VALUE_EXCEEDED,
  })
  voteAverage!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_VOTE_COUNT })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: BadRequestExceptionMessageKeys.PROVIDE_NUMBER },
  )
  voteCount!: number;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_RELEASE_DATE })
  @IsDateString(undefined, {
    message: BadRequestExceptionMessageKeys.INVALID_DATE_PROVIDED,
  })
  releaseDate!: string;

  @IsNotEmpty({ message: BadRequestExceptionMessageKeys.PROVIDE_GENRES })
  @IsArray({ message: BadRequestExceptionMessageKeys.PROVIDE_ARRAY })
  @Type(() => GenreDto)
  @ValidateNested({
    each: true,
    message: BadRequestExceptionMessageKeys.PROVIDE_VALID_GENRE_OBJECTS,
  })
  genres!: GenreDto[];
}
