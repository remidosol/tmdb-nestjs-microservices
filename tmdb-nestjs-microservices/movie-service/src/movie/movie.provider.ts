import { forwardRef } from "@nestjs/common";
import { AsyncModelFactory } from "@nestjs/mongoose";
import { Movie, MovieSchema, MovieDocument } from "./schemas/movie.schema";

export const MovieSchemaProvider: AsyncModelFactory = {
  name: Movie.name,
  collection: "netflix.movies",
  // imports: [],
  useFactory: async () => {
    // MovieSchema.pre("save", async function (next) {
    //   if (this.isNew) {
    //     next();
    //   }

    //   next();
    // });

    // MovieSchema.post<MovieDocument>(
    //   /^(delete|remove|findOneAndRemove|findOneAndDelete)/,
    //   { document: true },
    //   async function (_res, next) {
    //     next();
    //   }
    // );

    return MovieSchema;
  },
  // inject: [],
};
