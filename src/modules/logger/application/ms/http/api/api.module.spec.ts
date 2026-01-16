import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from './api.module';
import { ApiController } from './api.controller';
import { ClientsService } from './api.service';
import { CreateLogUseCase } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.usecase';
import { ElasticService } from '@shared/adapters/repository/elastic/elastic.service';

describe('Logger ApiModule', () => {
  let module: TestingModule;

  const mockElasticService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [LoggerModule],
    })
      .overrideProvider(ElasticService)
      .useValue(mockElasticService)
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide ApiController', () => {
    const controller = module.get<ApiController>(ApiController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(ApiController);
  });

  it('should provide ClientsService', () => {
    const service = module.get<ClientsService>(ClientsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(ClientsService);
  });

  it('should provide CreateLogUseCase', () => {
    const useCase = module.get<CreateLogUseCase>(CreateLogUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(CreateLogUseCase);
  });
});
