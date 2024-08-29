import { Module } from '@nestjs/common';

import { ElasticAdapterModule } from '@shared/adapters/repository/elastic/elastic.module';

import { CreateLogUseCase } from './CreateLog.usecase';

@Module({
  imports: [ElasticAdapterModule],
  providers: [CreateLogUseCase],
  exports: [CreateLogUseCase],
})
export class CreateOrderModule {}
