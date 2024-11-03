import { Module } from '@nestjs/common';

import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module';

import { CreateOrderUseCase } from './CreateProduct.usecase';

@Module({
  imports: [OrderRepositoryModule],
  providers: [CreateOrderUseCase],
  exports: [CreateOrderUseCase],
})
export class CreateOrderModule {}
