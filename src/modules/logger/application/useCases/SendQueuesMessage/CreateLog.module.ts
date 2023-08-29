import { Module } from '@nestjs/common';

import { ElasticAdapterModule } from '@shared/adapters/repository/elastic/elastic.module';

import { CreateLogUseCase } from './CreateLog.usecase';
import { CreateLogController } from './CreateLog.controller';

@Module({
  imports: [ElasticAdapterModule],
  providers: [CreateLogController, CreateLogUseCase],
  exports: [CreateLogController],
})
export class CreateOrderModule {}
