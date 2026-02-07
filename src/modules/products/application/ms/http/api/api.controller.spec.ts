import type { TestingModule } from '@nestjs/testing';
import type { CreateOrderDTO } from './api.dto';
import { Test } from '@nestjs/testing';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiController } from './api.controller';
import ClientsService from './api.service';

describe('apiController (Products)', () => {
  let controller: ApiController;
  let clientsService: ClientsService;

  const mockClientService = {
    createProduct: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientService,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    clientsService = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should call clientsService.createProduct with correct dto', async () => {
      const dto: CreateOrderDTO = {
        items: ['item1', 'item2'],
      };

      const expectedResponse = {
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: [{ value: 'item1' }, { value: 'item2' }],
          },
        },
      };

      mockClientService.createProduct.mockResolvedValue(expectedResponse);

      const result = await controller.createOrder(dto);

      expect(clientsService.createProduct).toHaveBeenCalledWith({
        items: ['item1', 'item2'],
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should pass items from body to service', async () => {
      const dto: CreateOrderDTO = {
        items: ['single-item'],
      };

      mockClientService.createProduct.mockResolvedValue({
        status: 'success',
        message: 'created order successfully',
        data: { orderValidated: { items: [{ value: 'single-item' }] } },
      });

      await controller.createOrder(dto);

      expect(clientsService.createProduct).toHaveBeenCalledWith({
        items: ['single-item'],
      });
    });

    it('should return the response from service', async () => {
      const dto: CreateOrderDTO = {
        items: ['test'],
      };

      const expectedResponse = {
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: [{ value: 'test' }],
          },
        },
      };

      mockClientService.createProduct.mockResolvedValue(expectedResponse);

      const result = await controller.createOrder(dto);

      expect(result).toEqual(expectedResponse);
    });

    it('should handle empty items array', async () => {
      const dto: CreateOrderDTO = {
        items: [],
      };

      mockClientService.createProduct.mockResolvedValue({
        status: 'success',
        message: 'created order successfully',
        data: { orderValidated: { items: [] } },
      });

      const result = await controller.createOrder(dto);

      expect(clientsService.createProduct).toHaveBeenCalledWith({ items: [] });
      expect(result.status).toBe('success');
    });

    it('should handle multiple items', async () => {
      const dto: CreateOrderDTO = {
        items: ['item1', 'item2', 'item3', 'item4', 'item5'],
      };

      mockClientService.createProduct.mockResolvedValue({
        status: 'success',
        message: 'created order successfully',
        data: {
          orderValidated: {
            items: dto.items.map(i => ({ value: i })),
          },
        },
      });

      await controller.createOrder(dto);

      expect(clientsService.createProduct).toHaveBeenCalledWith({
        items: ['item1', 'item2', 'item3', 'item4', 'item5'],
      });
    });

    it('should handle error response from service', async () => {
      const dto: CreateOrderDTO = {
        items: ['error-item'],
      };

      const errorResponse = {
        status: 'error',
        message: 'error creating order',
        data: { error: 'Some error occurred' },
      };

      mockClientService.createProduct.mockResolvedValue(errorResponse);

      const result = await controller.createOrder(dto);

      expect(result).toEqual(errorResponse);
    });
  });
});
