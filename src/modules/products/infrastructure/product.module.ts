import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { OrderRepositoryAdapter } from '@modules/order/adapters/repository/order.adapter';
import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module';
import { OrderService } from '@modules/order/adapters/repository/order.service';
import { CreateProductUseCase } from '@modules/products/application/useCases/CreateProduct.usecase';

@Module({
  imports: [OrderRepositoryModule],
  providers: [
    CreateProductUseCase,
    {
      provide: 'ProductServicePort',
      useFactory: (orderRepositoryAdapter: OrderRepositoryAdapter, eventEmitter: EventEmitter2) =>
        new OrderService(orderRepositoryAdapter, eventEmitter),
      inject: [OrderRepositoryAdapter, EventEmitter2],
    },
  ],
  exports: [CreateProductUseCase],
})
export class ProductInfrastructureModule {}
