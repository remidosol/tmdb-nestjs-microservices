import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose, Transform } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";

/**
 * To create and serialize Movie schema/entity
 */
@Schema({
  _id: false,
  id: false,
})
export class Genre {
  @Prop({
    type: Number,
    required: true,
  })
  id!: number;

  @Prop({
    type: String,
    required: true,
  })
  name!: string;
}

/**
 * To create and serialize Movie schema/entity
 */
@Schema({
  id: false,
  timestamps: { createdAt: false, updatedAt: false },
  toJSON: { virtuals: true, flattenMaps: false, aliases: false },
  collection: "netflix.movies",
  versionKey: false,
})
export class Movie {
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj._id.toString())
  _id!: Types.ObjectId;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  id!: string;

  @Prop({
    type: String,
    required: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
  })
  overview!: string;

  @Prop({
    type: Number,
    required: true,
  })
  popularity!: number;

  @Prop({
    type: Number,
    required: true,
  })
  voteAverage!: number;

  @Prop({
    type: Number,
    required: true,
  })
  voteCount!: number;

  @Prop({
    type: String,
    required: true,
  })
  releaseDate!: string;

  @Prop({
    type: [Genre],
    required: true,
  })
  genres!: Genre[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
export type MovieDocument = HydratedDocument<Movie>;
