import { Test, TestingModule } from "@nestjs/testing";
import { ApiGatewayMovieController } from "../movie.controller";

describe("ApiGatewayMovieController", () => {
  let controller: ApiGatewayMovieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayMovieController],
    }).compile();

    controller = module.get<ApiGatewayMovieController>(
      ApiGatewayMovieController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
