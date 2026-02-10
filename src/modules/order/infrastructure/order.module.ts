import { OrderDataSource } from '@modules/order/adapters/repository/order.adapter'
import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module'
import { OrderRepository } from '@modules/order/adapters/repository/order.repository'
import { CreateOrderUseCase } from '@modules/order/application/useCases/CreateOrder.usecase'

import { Module } from '@nestjs/common'

import { EventEmitter2 } from '@nestjs/event-emitter'
import { OrderMapper } from '../adapters/repository/order.mapper'

@Module({
  imports: [OrderRepositoryModule],
  providers: [
    CreateOrderUseCase,
    {
      provide: 'OrderRepositoryPort',
      useFactory: (orderDataSource: OrderDataSource, eventEmitter: EventEmitter2, orderMapper: OrderMapper) =>
        new OrderRepository(orderDataSource, orderMapper, eventEmitter),
      inject: [OrderDataSource, EventEmitter2, OrderMapper],
    },
  ],
  exports: [CreateOrderUseCase],
})
export class OrderInfrastructureModule {}
