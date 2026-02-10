import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ElasticService } from '@shared/adapters/repository/elastic/elastic.service';
import { CreateOrderModule } from './CreateLog.module';
import { CreateLogUseCase } from './CreateLog.usecase';

describe('createLogModule', () => {
  let module: TestingModule;

  const mockElasticService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CreateOrderModule],
    })
      .overrideProvider(ElasticService)
      .useValue(mockElasticService)
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CreateLogUseCase', () => {
    const useCase = module.get<CreateLogUseCase>(CreateLogUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(CreateLogUseCase);
  });

  it('should export CreateLogUseCase', async () => {
    const parentModule = await Test.createTestingModule({
      imports: [CreateOrderModule],
    })
      .overrideProvider(ElasticService)
      .useValue(mockElasticService)
      .compile();

    const useCase = parentModule.get<CreateLogUseCase>(CreateLogUseCase);
    expect(useCase).toBeDefined();
  });
});
