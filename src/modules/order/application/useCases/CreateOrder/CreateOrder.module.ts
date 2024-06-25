import { Module } from '@nestjs/common';

import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module';

import { CreateOrderUseCase } from './CreateOrder.usecase';
import { CreateOrderController } from './CreateOrder.controller';

@Module({
  imports: [OrderRepositoryModule],
  providers: [CreateOrderController, CreateOrderUseCase],
  exports: [CreateOrderController],
})
export class CreateOrderModule {}
