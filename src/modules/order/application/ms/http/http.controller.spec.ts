import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@config/config.module';
import { HttpAdapterModule } from '@shared/adapters/http/axios/http.module';

import { OrderRepositoryAdapter } from '@modules/order/adapters/repository/order.adapter';
import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module';
import { CreateOrderUseCase } from '@modules/order/application/useCases/CreateOrder.usecase';

import { ApiController } from './api/api.controller';
import { OrderModule } from './api/api.module';
import ApiService from './api/api.service';
import { Logger } from './config/logger';
import CoreController from './core/core.controller';
import { CoreModule } from './core/core.module';

describe('CoreController', () => {
  let appController: CoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    appController = app.get<CoreController>(CoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck().status).toBe('success');
    });
  });
});

describe('ApiController', () => {
  let appController: ApiController;

  const mockOrderService = {
    getAllOrders: () => Promise.resolve([]),
    getOrderById: (_id: string) => Promise.resolve({ items: [] }),
    createOrder: (order: any) => Promise.resolve(order),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          { name: 'LOGGER_SERVICE', options: { host: 'localhost:3001' }, transport: Transport.TCP },
        ]),
        ConfigModule,
        OrderModule,
        HttpAdapterModule,
        OrderRepositoryModule,
        Logger,
      ],
      controllers: [ApiController],
      providers: [
        ApiService,
        OrderRepositoryAdapter,
        CreateOrderUseCase,
        { provide: 'OrderServicePort', useValue: mockOrderService },
      ],
    })
      .overrideProvider(OrderRepositoryAdapter)
      .useValue({ orders: { create: (items: string[]) => Promise.resolve({ items }) } })
      .compile();

    appController = app.get<ApiController>(ApiController);
  });

  describe('getSeasonByYear', () => {
    it('should return "success"', async () => {
      const dto = {
        items: ['hola', 'mundo'],
      };

      const result = await appController.createOrder(dto);

      expect(result.status).toBe('success');
    });
  });
});
