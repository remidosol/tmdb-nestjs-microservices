import { ObjectType, Field, Float, Int } from "@nestjs/graphql";

export const MOVIE_SERVICE = Symbol();

@ObjectType()
export class Genre {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;
}

@ObjectType()
export class Movie {
  @Field()
  _id!: string;

  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  overview!: string;

  @Field(() => Float)
  popularity!: number;

  @Field(() => Float)
  voteAverage!: number;

  @Field(() => Int)
  voteCount!: number;

  @Field()
  releaseDate!: string;

  @Field(() => [Genre])
  genres!: Genre[];
}
