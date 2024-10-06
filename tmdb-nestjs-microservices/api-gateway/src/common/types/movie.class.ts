export class Genre {
  id!: number;

  name!: string;
}

export class Movie {
  _id!: string;

  id!: string;

  name!: string;

  overview!: string;

  popularity!: number;

  voteAverage!: number;

  voteCount!: number;

  releaseDate!: string;

  genres!: Genre[];
}
