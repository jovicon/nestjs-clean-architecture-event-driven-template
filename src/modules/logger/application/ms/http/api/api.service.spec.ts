import type { CreateLogDTO } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';
import type { TestingModule } from '@nestjs/testing';

import { CreateLogUseCase } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.usecase';
import { Test } from '@nestjs/testing';
import { ClientsService } from './api.service';

describe('logger ClientsService', () => {
  let service: ClientsService;
  let createLogUseCase: CreateLogUseCase;

  const mockCreateLogUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: CreateLogUseCase,
          useValue: mockCreateLogUseCase,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    createLogUseCase = module.get<CreateLogUseCase>(CreateLogUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLog', () => {
    it('should execute use case and return success response', async () => {
      const dto: CreateLogDTO = {
        id: 'test-id-123',
        item: ['log1', 'log2'],
      };

      const expectedResponse = {
        status: 'success',
        message: 'created order',
        data: {},
      };

      mockCreateLogUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await service.createLog(dto);

      expect(createLogUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });

    it('should execute use case and return error response', async () => {
      const dto: CreateLogDTO = {
        id: 'test-id-error',
        item: ['log1'],
      };

      const errorResponse = {
        status: 'error',
        message: 'error creating order',
        data: {},
      };

      mockCreateLogUseCase.execute.mockResolvedValue(errorResponse);

      const result = await service.createLog(dto);

      expect(createLogUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(errorResponse);
    });

    it('should spread use case response correctly', async () => {
      const dto: CreateLogDTO = {
        id: 'test-id-spread',
        item: ['log1', 'log2', 'log3'],
      };

      const useCaseResponse = {
        status: 'success',
        message: 'created order',
        data: { additionalInfo: 'test' },
      };

      mockCreateLogUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createLog(dto);

      expect(result).toEqual({
        status: 'success',
        message: 'created order',
        data: { additionalInfo: 'test' },
      });
    });
  });
});
