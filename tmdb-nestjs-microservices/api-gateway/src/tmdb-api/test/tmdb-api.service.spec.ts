import { Test, TestingModule } from "@nestjs/testing";
import { ApiGatewayTmdbApiService } from "../tmdb-api.service";

describe("ApiGatewayTmdbApiService", () => {
  let service: ApiGatewayTmdbApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiGatewayTmdbApiService],
    }).compile();

    service = module.get<ApiGatewayTmdbApiService>(ApiGatewayTmdbApiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
