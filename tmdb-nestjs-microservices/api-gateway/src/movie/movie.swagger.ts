import { ApiResponseOptions } from "@nestjs/swagger";

export const findAllResponse: ApiResponseOptions = {
  status: 200,
  content: {
    "application/json": {
      example: {
        statusCode: 200,
        data: [
          {
            id: "680",
            name: "Pulp Fiction",
            overview:
              "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
            popularity: 386.433,
            voteAverage: 8.489,
            voteCount: 27057,
            releaseDate: "1994-09-10",
            genres: [
              {
                id: 53,
                name: "Thriller",
              },
              {
                id: 80,
                name: "Crime",
              },
            ],
            _id: "6641473ae995e840555e4c45",
            __v: 0,
          },
          {
            id: "550",
            name: "Fight Club",
            overview:
              'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
            popularity: 250.297,
            voteAverage: 8.441,
            voteCount: 28495,
            releaseDate: "1999-10-15",
            genres: [
              {
                id: 18,
                name: "Drama",
              },
            ],
            _id: "6641473ae995e840555e4c48",
            __v: 0,
          },
          {
            id: "13",
            name: "Forrest Gump",
            overview:
              "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.",
            popularity: 234.257,
            voteAverage: 8.475,
            voteCount: 26588,
            releaseDate: "1994-06-23",
            genres: [
              {
                id: 35,
                name: "Comedy",
              },
              {
                id: 18,
                name: "Drama",
              },
              {
                id: 10749,
                name: "Romance",
              },
            ],
            _id: "6641473ae995e840555e4c4b",
            __v: 0,
          },
          {
            id: "238",
            name: "The Godfather",
            overview:
              "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
            popularity: 136.675,
            voteAverage: 8.696,
            voteCount: 19812,
            releaseDate: "1972-03-14",
            genres: [
              {
                id: 18,
                name: "Drama",
              },
              {
                id: 80,
                name: "Crime",
              },
            ],
            _id: "6641473ae995e840555e4c4e",
            __v: 0,
          },
          {
            id: "324857",
            name: "Spider-Man: Into the Spider-Verse",
            overview:
              'Struggling to find his place in the world while juggling school and family, Brooklyn teenager Miles Morales is unexpectedly bitten by a radioactive spider and develops unfathomable powers just like the one and only Spider-Man. While wrestling with the implications of his new abilities, Miles discovers a super collider created by the madman Wilson "Kingpin" Fisk, causing others from across the Spider-Verse to be inadvertently transported to his dimension.',
            popularity: 119.086,
            voteAverage: 8.403,
            voteCount: 14980,
            releaseDate: "2018-12-06",
            genres: [
              {
                id: 16,
                name: "Animation",
              },
              {
                id: 28,
                name: "Action",
              },
              {
                id: 12,
                name: "Adventure",
              },
              {
                id: 878,
                name: "Science Fiction",
              },
            ],
            _id: "6641473ae995e840555e4c51",
            __v: 0,
          },
        ],
      },
    },
  },
};

export const commonResponse: ApiResponseOptions = {
  status: 200,
  content: {
    "application/json": {
      example: {
        statusCode: 200,
        data: {
          _id: "6530ee855d975a7017f57010",
          id: "55",
          name: "The Godfather",
          overview: "Overview of the movie.",
          popularity: 73.545,
          voteAverage: 9.2,
          voteCount: 10000,
          releaseDate: "1972-03-14",
          genres: [
            {
              id: 1,
              name: "Crime",
            },
            {
              id: 2,
              name: "Drama",
            },
          ],
        },
      },
    },
  },
};
