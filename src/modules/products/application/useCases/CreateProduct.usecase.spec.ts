import type { TestingModule } from '@nestjs/testing';
import type { CreateOrderDTO, ProductServicePort } from '../ports/OrderService.port';

import { Test } from '@nestjs/testing';
import { RequestContextService } from '@shared/application/context/AppRequestContext';
import { CreateProductUseCase } from './CreateProduct.usecase';

describe('createProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productService: ProductServicePort;

  const mockProductService: ProductServicePort = {
    createOrder: jest.fn().mockResolvedValue({ items: [] }),
  };

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: 'ProductServicePort',
          useValue: mockProductService,
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    productService = module.get<ProductServicePort>('ProductServicePort');

    jest.spyOn(RequestContextService, 'getRequestId').mockReturnValue('test-request-id-123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should successfully create a product with valid items', async () => {
      const dto: CreateOrderDTO = {
        items: ['item1', 'item2', 'item3'],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('success');
      expect(result.message).toBe('created order successfully');
      expect(result.data).toHaveProperty('orderValidated');

      if ('orderValidated' in result.data) {
        expect(result.data.orderValidated.items).toHaveLength(3);
        expect(result.data.orderValidated.items[0].value).toBe('item1');
        expect(result.data.orderValidated.items[1].value).toBe('item2');
        expect(result.data.orderValidated.items[2].value).toBe('item3');
      }

      expect(productService.createOrder).toHaveBeenCalled();
    });

    it('should create product with single item', async () => {
      const dto: CreateOrderDTO = {
        items: ['single-item'],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('success');
      expect(result.message).toBe('created order successfully');

      if ('orderValidated' in result.data) {
        expect(result.data.orderValidated.items).toHaveLength(1);
        expect(result.data.orderValidated.items[0].value).toBe('single-item');
      }

      expect(productService.createOrder).toHaveBeenCalledWith(
        { items: ['single-item'] },
        expect.any(Object),
      );
    });

    it('should call productService.createOrder with correct parameters', async () => {
      const dto: CreateOrderDTO = {
        items: ['test-item-1', 'test-item-2'],
      };

      await useCase.execute(dto);

      expect(productService.createOrder).toHaveBeenCalledTimes(1);

      const callArgs = (productService.createOrder as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toEqual({ items: ['test-item-1', 'test-item-2'] });
      expect(callArgs[1]).toBeDefined();
      expect(callArgs[1].constructor.name).toBe('Order');
    });

    it('should transform OrderItem entities to plain values', async () => {
      const dto: CreateOrderDTO = {
        items: ['value1', 'value2'],
      };

      await useCase.execute(dto);

      const callArgs = (productService.createOrder as jest.Mock).mock.calls[0];
      expect(callArgs[0].items).toEqual(['value1', 'value2']);
    });

    it('should create Order aggregate with domain events', async () => {
      const dto: CreateOrderDTO = {
        items: ['event-test-item'],
      };

      await useCase.execute(dto);

      const callArgs = (productService.createOrder as jest.Mock).mock.calls[0];
      const orderAggregate = callArgs[1];

      expect(orderAggregate).toBeDefined();
      expect(orderAggregate.id).toBeDefined();
    });

    it('should return error when OrderItem creation fails with null value', async () => {
      const dto: CreateOrderDTO = {
        items: [null as any, 'valid-item'],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('error');
      expect(result.message).toBe('error creating order');
      expect(result.data).toHaveProperty('error');
    });

    it('should return error when OrderItem creation fails with undefined value', async () => {
      const dto: CreateOrderDTO = {
        items: [undefined as any],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('error');
      expect(result.message).toBe('error creating order');
    });

    it('should create product with multiple items and preserve order', async () => {
      const dto: CreateOrderDTO = {
        items: ['first', 'second', 'third', 'fourth'],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('success');

      if ('orderValidated' in result.data) {
        const values = result.data.orderValidated.items.map(item => item.value);
        expect(values).toEqual(['first', 'second', 'third', 'fourth']);
      }
    });

    it('should handle empty items array gracefully', async () => {
      const dto: CreateOrderDTO = {
        items: [],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('success');

      if ('orderValidated' in result.data) {
        expect(result.data.orderValidated.items).toHaveLength(0);
      }
    });

    it('should return validated order in response data', async () => {
      const dto: CreateOrderDTO = {
        items: ['validated-item'],
      };

      const result = await useCase.execute(dto);

      expect(result.data).toHaveProperty('orderValidated');

      if ('orderValidated' in result.data) {
        expect(result.data.orderValidated).toHaveProperty('items');
        expect(Array.isArray(result.data.orderValidated.items)).toBe(true);
      }
    });

    it('should handle items with special characters', async () => {
      const dto: CreateOrderDTO = {
        items: ['item-@#$%', 'item-日本語', 'item-émoji-🎉'],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('success');

      if ('orderValidated' in result.data) {
        expect(result.data.orderValidated.items[0].value).toBe('item-@#$%');
        expect(result.data.orderValidated.items[1].value).toBe('item-日本語');
        expect(result.data.orderValidated.items[2].value).toBe('item-émoji-🎉');
      }
    });

    it('should handle items with whitespace', async () => {
      const dto: CreateOrderDTO = {
        items: ['   leading', 'trailing   ', '  both  '],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('success');

      if ('orderValidated' in result.data) {
        expect(result.data.orderValidated.items[0].value).toBe('   leading');
        expect(result.data.orderValidated.items[1].value).toBe('trailing   ');
        expect(result.data.orderValidated.items[2].value).toBe('  both  ');
      }
    });

    it('should return error response when an exception occurs', async () => {
      (productService.createOrder as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Service error');
      });

      const dto: CreateOrderDTO = {
        items: ['test'],
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('error');
      expect(result.message).toBe('error creating order');
    });
  });
});
