import type { TestingModule } from '@nestjs/testing';
import type { Order } from './order.schema';
import { Order as OrderEntity } from '@modules/order/domain/order';

import { OrderItem } from '@modules/order/domain/orderItem';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { RequestContextService } from '@shared/application/context/AppRequestContext';
import { OrderRepositoryAdapter } from './order.adapter';
import { OrderService } from './order.service';

describe('orderService (Order)', () => {
  let service: OrderService;
  let orderRepository: OrderRepositoryAdapter;
  let eventEmitter: EventEmitter2;

  const mockOrderRepository = {
    orders: {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emitAsync: jest.fn().mockResolvedValue(undefined),
  };

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(async () => {
    jest.spyOn(RequestContextService, 'getRequestId').mockReturnValue('test-request-id');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepositoryAdapter,
          useValue: mockOrderRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepositoryAdapter>(OrderRepositoryAdapter);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order and return query result', async () => {
      const orderSchema: Order = {
        items: ['item1', 'item2'],
      };

      const item = OrderItem.create({ value: 'item1' }).getValue();
      const orderEntity = OrderEntity.create({ items: [item] }).getValue();

      const expectedResult = { ...orderSchema, _id: 'mongo-id-123' };
      mockOrderRepository.orders.create.mockResolvedValue(expectedResult);

      const result = await service.createOrder(orderSchema, orderEntity);

      expect(result).toEqual(expectedResult);
      expect(mockOrderRepository.orders.create).toHaveBeenCalledWith(orderSchema);
    });

    it('should publish events after creating order', async () => {
      const orderSchema: Order = {
        items: ['event-item'],
      };

      const item = OrderItem.create({ value: 'event-item' }).getValue();
      const orderEntity = OrderEntity.create({ items: [item] }).getValue();

      mockOrderRepository.orders.create.mockResolvedValue(orderSchema);

      await service.createOrder(orderSchema, orderEntity);

      expect(mockEventEmitter.emitAsync).toHaveBeenCalled();
    });

    it('should call repository create with order schema', async () => {
      const orderSchema: Order = {
        items: ['test-item'],
      };

      const item = OrderItem.create({ value: 'test-item' }).getValue();
      const orderEntity = OrderEntity.create({ items: [item] }).getValue();

      mockOrderRepository.orders.create.mockResolvedValue(orderSchema);

      await service.createOrder(orderSchema, orderEntity);

      expect(mockOrderRepository.orders.create).toHaveBeenCalledWith(orderSchema);
      expect(mockOrderRepository.orders.create).toHaveBeenCalledTimes(1);
    });

    it('should handle empty items array', async () => {
      const orderSchema: Order = {
        items: [],
      };

      const orderEntity = OrderEntity.create({ items: [] }).getValue();

      mockOrderRepository.orders.create.mockResolvedValue(orderSchema);

      const result = await service.createOrder(orderSchema, orderEntity);

      expect(result.items).toHaveLength(0);
    });

    it('should handle multiple items', async () => {
      const orderSchema: Order = {
        items: ['item1', 'item2', 'item3', 'item4', 'item5'],
      };

      const items = orderSchema.items.map(i => OrderItem.create({ value: i }).getValue());
      const orderEntity = OrderEntity.create({ items }).getValue();

      mockOrderRepository.orders.create.mockResolvedValue(orderSchema);

      const result = await service.createOrder(orderSchema, orderEntity);

      expect(result.items).toHaveLength(5);
    });
  });
});
