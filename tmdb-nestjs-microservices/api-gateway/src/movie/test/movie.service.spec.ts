import { Test, TestingModule } from "@nestjs/testing";
import { ApiGatewayMovieService } from "../movie.service";

describe("ApiGatewayMovieService", () => {
  let service: ApiGatewayMovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiGatewayMovieService],
    }).compile();

    service = module.get<ApiGatewayMovieService>(ApiGatewayMovieService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
