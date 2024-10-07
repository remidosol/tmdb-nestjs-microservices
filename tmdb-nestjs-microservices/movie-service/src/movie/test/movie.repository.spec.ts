import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { MovieRepository } from "../movie.repository";
import { Movie } from "../schemas/movie.schema";
import { makeMockMovie } from "./stubs";

type MockModel = {
  create: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  findOneAndDelete: jest.Mock;
  save: jest.Mock;
};

describe("MovieRepository", () => {
  let repository: MovieRepository;
  let mockModel: MockModel;

  const mockMovieData: Movie = makeMockMovie();

  beforeEach(async () => {
    const modelMock: MockModel = {
      create: jest.fn(),
      find: jest
        .fn()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockMovieData]),
        }),
      findOne: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockMovieData) }),
      findOneAndDelete: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      save: jest.fn().mockReturnValue(mockMovieData),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieRepository,
        {
          provide: getModelToken(Movie.name),
          useValue: modelMock,
        },
      ],
    }).compile();

    repository = module.get<MovieRepository>(MovieRepository);
    mockModel = module.get<MockModel>(getModelToken(Movie.name));
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("save", () => {
    it("should successfully insert a movie", async () => {
      jest
        .spyOn(mockModel, "create")
        .mockImplementation(() =>
          Promise.resolve({ save: jest.fn().mockResolvedValue(mockMovieData) }),
        );

      const result = await repository.save(mockMovieData);
      expect(mockModel.create).toHaveBeenCalledWith(mockMovieData);

      expect(result).toEqual(mockMovieData);
    });
  });

  describe("findAll", () => {
    it("should return an array of movies", async () => {
      jest
        .spyOn(mockModel, "find")
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockMovieData]),
        });

      const result = await repository.findAll();

      expect(mockModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockMovieData]);
    });
  });

  describe("findById", () => {
    it("should call findByIdAndDelete with the correct ID", async () => {
      jest.spyOn(mockModel, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMovieData),
      });

      const result = await repository.findById(mockMovieData.id);
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: mockMovieData.id });
      expect(result).toEqual(mockMovieData);
    });

    it("should return null if no movie is found by the given ID", async () => {
      const nonExistentId = "999999";

      jest.spyOn(mockModel, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById(nonExistentId);
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: nonExistentId });
      expect(result).toBeNull();
    });
  });

  describe("remove", () => {
    it("should call findOneAndDelete with the correct ID", async () => {
      jest.spyOn(mockModel, "findOneAndDelete").mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });

      await repository.removeById(mockMovieData.id);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
        id: mockMovieData.id,
      });
    });

    it("should not throw an error if the movie ID does not exist", async () => {
      const nonExistentId = "999999";

      jest.spyOn(mockModel, "findOneAndDelete").mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repository.removeById(nonExistentId)).resolves.not.toThrow();

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
        id: nonExistentId,
      });
    });
  });
});
