import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateOrderUseCase } from '@modules/order/application/useCases/CreateOrder.usecase';

import { ApiController } from './api/api.controller';
import ClientsService from './api/api.service';
import CoreController from './core/core.controller';
import CoreService from './core/core.service';

describe('CoreController', () => {
  let appController: CoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [CoreService],
    }).compile();

    appController = app.get<CoreController>(CoreController);
  });

  describe('root', () => {
    it('should return "success" status', () => {
      expect(appController.healthCheck().status).toBe('success');
    });
  });
});

describe('ApiController', () => {
  let appController: ApiController;

  const mockCreateOrderUseCase = {
    execute: jest.fn().mockResolvedValue({
      status: 'success',
      message: 'Order created successfully',
      data: { items: ['item1', 'item2'] },
    }),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        ClientsService,
        {
          provide: CreateOrderUseCase,
          useValue: mockCreateOrderUseCase,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    appController = app.get<ApiController>(ApiController);
  });

  describe('createOrder', () => {
    it('should return "success"', async () => {
      const dto = {
        items: ['hola', 'mundo'],
      };

      const result = await appController.createOrder(dto);

      expect(result.status).toBe('success');
      expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });
});
