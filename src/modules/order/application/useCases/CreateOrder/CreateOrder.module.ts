import { Module } from '@nestjs/common';

import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateOrderUseCase } from './CreateOrder.usecase';
import { OrderService } from '../../../adapters/repository/order.service';
import { OrderRepositoryAdapter } from '../../../adapters/repository/order.adapter';
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
export class CreateOrderModule {}
