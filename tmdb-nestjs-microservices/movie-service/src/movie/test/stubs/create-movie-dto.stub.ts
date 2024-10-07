import { faker } from "@faker-js/faker";
import { CreateMovieDto, GenreDto } from "../../dto";

/**
 * Generates a mock CreateMovieDto object.
 *
 * @returns  [`CreateMovieDto`](../../dto/create-movie.dto.ts)
 */
export const makeMockCreateMovieDto = (): CreateMovieDto => {
  const genreCount = faker.number.int({ min: 1, max: 5 });

  const genres: GenreDto[] = Array.from({ length: genreCount }, () => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.lorem.words({ min: 1, max: 2 }),
  }));

  return {
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
