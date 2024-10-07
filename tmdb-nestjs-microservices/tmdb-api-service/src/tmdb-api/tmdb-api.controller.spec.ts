import { Test, TestingModule } from "@nestjs/testing";
import { TmdbApiController } from "./tmdb-api.controller";
import { TmdbApiService } from "./tmdb-api.service";

describe("TmdbApiController", () => {
  let appController: TmdbApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TmdbApiController],
      providers: [TmdbApiService],
    }).compile();

    appController = app.get<TmdbApiController>(TmdbApiController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe("Hello World!");
    });
  });
});
