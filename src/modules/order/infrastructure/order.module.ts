import { OrderRepositoryAdapter } from '@modules/order/adapters/repository/order.adapter';
import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module';

import { OrderService } from '@modules/order/adapters/repository/order.service';
import { CreateOrderUseCase } from '@modules/order/application/useCases/CreateOrder.usecase';
import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [OrderRepositoryModule],
  providers: [
    CreateOrderUseCase,
    {
      provide: 'OrderServicePort',
      useFactory: (orderRepositoryAdapter: OrderRepositoryAdapter, eventEmitter: EventEmitter2) =>
        new OrderService(orderRepositoryAdapter, eventEmitter),
      inject: [OrderRepositoryAdapter, EventEmitter2],
    },
  ],
  exports: [CreateOrderUseCase],
})
export class OrderInfrastructureModule {}
