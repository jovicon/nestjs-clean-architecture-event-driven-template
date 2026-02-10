import type { TestingModule } from '@nestjs/testing';
import type { Model } from 'mongoose';
import type { OrderDocument } from './order.schema';
import { getModelToken } from '@nestjs/mongoose';

import { Test } from '@nestjs/testing';
import { OrderRepositoryAdapter } from './order.adapter';
import { Order } from './order.schema';

describe('orderRepositoryAdapter (Order)', () => {
  let adapter: OrderRepositoryAdapter;
  let orderModel: Model<OrderDocument>;

  const mockOrderModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepositoryAdapter,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
      ],
    }).compile();

    adapter = module.get<OrderRepositoryAdapter>(OrderRepositoryAdapter);
    orderModel = module.get<Model<OrderDocument>>(getModelToken(Order.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should initialize orders MongoRepositoryService', () => {
      expect(adapter.orders).toBeUndefined();

      adapter.onApplicationBootstrap();

      expect(adapter.orders).toBeDefined();
    });

    it('should create MongoRepositoryService with the model', () => {
      adapter.onApplicationBootstrap();

      expect(adapter.orders).toBeDefined();
      expect(adapter.orders.constructor.name).toBe('MongoRepositoryService');
    });
  });

  describe('orders property', () => {
    it('should have orders property after bootstrap', () => {
      adapter.onApplicationBootstrap();

      expect(adapter.orders).toBeDefined();
    });

    it('should have orders undefined before bootstrap', () => {
      expect(adapter.orders).toBeUndefined();
    });
  });
});
