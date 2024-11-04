import { Module } from '@nestjs/common';

import { OrderRepositoryModule } from '@modules/products/adapters/repository/order.module';
import { InternalCacheModule } from '@shared/adapters/cache/CacheModule';

import { CreateOrderUseCase } from './CreateProduct.usecase';

@Module({
  imports: [OrderRepositoryModule, InternalCacheModule],
  providers: [CreateOrderUseCase],
  exports: [CreateOrderUseCase],
})
export class CreateOrderModule {}
