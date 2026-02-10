import type { TestingModule } from '@nestjs/testing';
import { CreateLogUseCase } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.usecase';

import { Test } from '@nestjs/testing';
import { ElasticService } from '@shared/adapters/repository/elastic/elastic.service';
import { LoggerController } from './tcp.controller';
import { TcpModule } from './tcp.module';

describe('logger TcpModule', () => {
  let module: TestingModule;

  const mockElasticService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TcpModule],
    })
      .overrideProvider(ElasticService)
      .useValue(mockElasticService)
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide LoggerController', () => {
    const controller = module.get<LoggerController>(LoggerController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(LoggerController);
  });

  it('should provide CreateLogUseCase', () => {
    const useCase = module.get<CreateLogUseCase>(CreateLogUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(CreateLogUseCase);
  });
});
