import { Test, TestingModule } from '@nestjs/testing';

import ClientsService from './api.service';
import { CreateOrderUseCase } from '@modules/order/application/useCases/CreateOrder.usecase';
import { CreateOrderDTO } from '@modules/order/application/ports/orderService.port';

describe('ClientsService (Order)', () => {
  let service: ClientsService;
  let createOrderUseCase: CreateOrderUseCase;

  const mockCreateOrderUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: CreateOrderUseCase,
          useValue: mockCreateOrderUseCase,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    createOrderUseCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should call use case with correct dto', async () => {
      const dto: CreateOrderDTO = {
        items: ['item1', 'item2'],
      };

      const useCaseResponse = {
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: [{ value: 'item1' }, { value: 'item2' }],
          },
        },
      };

      mockCreateOrderUseCase.execute.mockResolvedValue(useCaseResponse);

      await service.createOrder(dto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('should return use case response', async () => {
      const dto: CreateOrderDTO = {
        items: ['test-item'],
      };

      const useCaseResponse = {
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: [{ value: 'test-item' }],
          },
        },
      };

      mockCreateOrderUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createOrder(dto);

      expect(result.status).toBe('success');
      expect(result.message).toBe('created order successfully');
    });

    it('should spread the use case response', async () => {
      const dto: CreateOrderDTO = {
        items: ['spread-test'],
      };

      const useCaseResponse = {
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: [{ value: 'spread-test' }],
          },
        },
      };

      mockCreateOrderUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createOrder(dto);

      expect(result).toEqual(expect.objectContaining({
        status: 'success',
        message: 'created order successfully',
      }));
    });

    it('should handle empty items array', async () => {
      const dto: CreateOrderDTO = {
        items: [],
      };

      const useCaseResponse = {
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: [] as Array<{ value: string }>,
          },
        },
      };

      mockCreateOrderUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createOrder(dto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith({ items: [] });
      expect(result.status).toBe('success');
    });

    it('should handle error response from use case', async () => {
      const dto: CreateOrderDTO = {
        items: ['error-item'],
      };

      const errorResponse = {
        status: 'error',
        message: 'error creating order',
        data: {
          error: 'Some error occurred',
        },
      };

      mockCreateOrderUseCase.execute.mockResolvedValue(errorResponse);

      const result = await service.createOrder(dto);

      expect(result.status).toBe('error');
      expect(result.message).toBe('error creating order');
    });
  });
});
