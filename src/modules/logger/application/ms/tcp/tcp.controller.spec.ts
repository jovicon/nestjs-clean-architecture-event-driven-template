import type { CreateLogDTO } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';
import type { TestingModule } from '@nestjs/testing';

import { CreateLogUseCase } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.usecase';
import { Test } from '@nestjs/testing';
import { LoggerController } from './tcp.controller';

describe('logger TCP Controller', () => {
  let controller: LoggerController;
  let createLogUseCase: CreateLogUseCase;

  const mockCreateLogUseCase = {
    execute: jest.fn(),
  };

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggerController],
      providers: [
        {
          provide: CreateLogUseCase,
          useValue: mockCreateLogUseCase,
        },
      ],
    }).compile();

    controller = module.get<LoggerController>(LoggerController);
    createLogUseCase = module.get<CreateLogUseCase>(CreateLogUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('executeLogger', () => {
    it('should handle createdOrder message pattern', async () => {
      const data: CreateLogDTO = {
        id: 'order-123',
        item: ['item1', 'item2'],
      };

      const expectedResponse = {
        status: 'success',
        message: 'created order',
        data: {},
      };

      mockCreateLogUseCase.execute.mockResolvedValue(expectedResponse);

      await controller.executeLogger(data);

      expect(consoleLogSpy).toHaveBeenCalledWith('LoggerController - executeLogger data: ', data);
      expect(createLogUseCase.execute).toHaveBeenCalledWith(data);
    });

    it('should execute use case without returning value', async () => {
      const data: CreateLogDTO = {
        id: 'order-456',
        item: ['log1'],
      };

      mockCreateLogUseCase.execute.mockResolvedValue({
        status: 'success',
        message: 'created order',
        data: {},
      });

      const result = await controller.executeLogger(data);

      expect(result).toBeUndefined();
      expect(createLogUseCase.execute).toHaveBeenCalledWith(data);
    });

    it('should handle empty items', async () => {
      const data: CreateLogDTO = {
        id: 'order-789',
        item: [],
      };

      mockCreateLogUseCase.execute.mockResolvedValue({
        status: 'success',
        message: 'created order',
        data: {},
      });

      await controller.executeLogger(data);

      expect(createLogUseCase.execute).toHaveBeenCalledWith(data);
      expect(consoleLogSpy).toHaveBeenCalledWith('LoggerController - executeLogger data: ', data);
    });

    it('should handle use case errors gracefully', async () => {
      const data: CreateLogDTO = {
        id: 'order-error',
        item: ['item1'],
      };

      const errorResponse = {
        status: 'error',
        message: 'error creating order',
        data: {},
      };

      mockCreateLogUseCase.execute.mockResolvedValue(errorResponse);

      await controller.executeLogger(data);

      expect(createLogUseCase.execute).toHaveBeenCalledWith(data);
    });
  });
});
