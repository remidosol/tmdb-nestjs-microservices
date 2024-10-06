import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "../movie.service";
import { MovieRepository } from "../movie.repository";
import { NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { CreateMovieDto } from "../dto";
import { makeMockCreateMovieDto } from "./stubs";
import { Movie } from "../schemas/movie.schema";
import { Types } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";

type MockModel = {
  create: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  findOneAndDelete: jest.Mock;
  save: jest.Mock;
};

describe("MovieService", () => {
  let service: MovieService;
  let movieRepository: MovieRepository;

  const mockCreateMovieDto: CreateMovieDto = makeMockCreateMovieDto();
  const mockMovieData: Movie = { ...mockCreateMovieDto, _id: new Types.ObjectId() };

  beforeEach(async () => {
    const modelMock: MockModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockMovieData]) }),
      findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockMovieData) }),
      findOneAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      save: jest.fn().mockReturnValue(mockMovieData),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        MovieRepository,
        {
          provide: getModelToken(Movie.name),
          useValue: modelMock,
        },
        { provide: Logger, useValue: { error: jest.fn(), verbose: jest.fn() } },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getMovies", () => {
    it("should return an array of movies", async () => {
      jest.spyOn(movieRepository, "findAll").mockImplementation(() => Promise.resolve([mockMovieData]));

      const result = await service.getMovies();
      expect(result).toEqual([mockMovieData]);
      expect(movieRepository.findAll).toHaveBeenCalled();
    });

    it("should throw BadRequestException if multiple order keys are provided", async () => {
      await expect(service.getMovies({ name: 1, voteAverage: -1 })).rejects.toThrow(BadRequestException);
    });
  });

  describe("findMovie", () => {
    it("should retrieve a movie by ID", async () => {
      jest.spyOn(movieRepository, "findById").mockResolvedValue(mockMovieData);

      const result = await service.findMovie(mockMovieData.id);
      expect(result).toEqual(mockMovieData);
      expect(movieRepository.findById).toHaveBeenCalledWith(mockMovieData.id);
    });

    it("should return null when movie is not found", async () => {
      const nonExistentId = "999999";

      jest.spyOn(movieRepository, "findById").mockImplementation(() => Promise.resolve(null));
      const result = await service.findMovie(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe("createMovie", () => {
    it("should save a new movie", async () => {
      jest.spyOn(movieRepository, "save").mockImplementation(() => Promise.resolve(mockMovieData));

      const result = await service.createMovie(mockCreateMovieDto);
      expect(result).toEqual(mockMovieData);
      expect(movieRepository.save).toHaveBeenCalledWith(expect.objectContaining(mockCreateMovieDto));
    });
  });

  describe("deleteMovie", () => {
    it("should delete the movie if it exists", async () => {
      jest.spyOn(movieRepository, "findById").mockResolvedValue(mockMovieData);
      jest.spyOn(movieRepository, "removeById").mockResolvedValue(Promise.resolve());

      const result = await service.deleteMovie(mockMovieData.id);
      expect(result).toEqual(mockMovieData);
      expect(movieRepository.removeById).toHaveBeenCalledWith(mockMovieData.id);
    });

    it("should throw NotFoundException if the movie does not exist", async () => {
      const nonExistentId = "999999";

      jest.spyOn(movieRepository, "findById").mockResolvedValue(null);
      jest.spyOn(movieRepository, "removeById").mockResolvedValue();

      const deletedMoviePromise = service.deleteMovie(nonExistentId);

      await expect(deletedMoviePromise).rejects.toThrow(NotFoundException);

      expect(movieRepository.findById).toHaveBeenCalledWith(nonExistentId);
    });
  });
});
