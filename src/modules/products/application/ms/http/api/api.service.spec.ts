import { Test, TestingModule } from '@nestjs/testing';

import ClientsService from './api.service';
import { CreateProductUseCase } from '@modules/products/application/useCases/CreateProduct.usecase';
import { CreateOrderDTO } from '@modules/order/application/ports/orderService.port';

describe('ClientsService (Products)', () => {
  let service: ClientsService;
  let createProductUseCase: CreateProductUseCase;

  const mockCreateProductUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: CreateProductUseCase,
          useValue: mockCreateProductUseCase,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    createProductUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
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

      mockCreateProductUseCase.execute.mockResolvedValue(useCaseResponse);

      await service.createProduct(dto);

      expect(createProductUseCase.execute).toHaveBeenCalledWith(dto);
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

      mockCreateProductUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createProduct(dto);

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
        extraField: 'should be included',
      };

      mockCreateProductUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createProduct(dto);

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

      mockCreateProductUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createProduct(dto);

      expect(createProductUseCase.execute).toHaveBeenCalledWith({ items: [] });
      expect(result.status).toBe('success');
    });

    it('should handle multiple items', async () => {
      const dto: CreateOrderDTO = {
        items: ['item1', 'item2', 'item3'],
      };

      const useCaseResponse = {
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: [{ value: 'item1' }, { value: 'item2' }, { value: 'item3' }],
          },
        },
      };

      mockCreateProductUseCase.execute.mockResolvedValue(useCaseResponse);

      const result = await service.createProduct(dto);

      expect(result.data).toHaveProperty('orderValidated');
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

      mockCreateProductUseCase.execute.mockResolvedValue(errorResponse);

      const result = await service.createProduct(dto);

      expect(result.status).toBe('error');
      expect(result.message).toBe('error creating order');
    });
  });
});
