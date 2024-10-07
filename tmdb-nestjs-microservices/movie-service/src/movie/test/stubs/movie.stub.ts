import { Types } from "mongoose";
import { Genre, Movie } from "../../schemas/movie.schema";
import { faker } from "@faker-js/faker";

/**
 * Generates a mock movie object.
 *
 * @returns  [`Movie`](../../movie.schema.ts)
 */
export const makeMockMovie = (): Movie => {
  const genreCount = faker.number.int({ min: 1, max: 5 });

  const genres: Genre[] = Array.from({ length: genreCount }, () => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.lorem.words({ min: 1, max: 2 }),
  }));

  return {
    _id: new Types.ObjectId(),
    id: faker.string.numeric({ length: { min: 1, max: 5 } }),
    name: faker.lorem.words({ min: 1, max: 3 }),
    overview: faker.lorem.paragraph(),
    popularity: faker.number.float({ min: 0, max: 100, fractionDigits: 3 }),
    voteAverage: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    voteCount: faker.number.int({ min: 0, max: 100000 }),
    releaseDate: faker.date
      .between({ from: "1931-01-01", to: "2024-05-11" })
      .toISOString()
      .split("T")[0],
    genres,
  };
};

/**
 * Generates an array of mock movies.
 *
 * @param {number} count - The number of mock movies to generate.
 * @returns [`Movie[]`](../../movie.schema.ts) - An array of mock movies.
 */
export const makeMockMovies = (count: number): Movie[] => {
  return Array.from({ length: count }, () => makeMockMovie());
};
