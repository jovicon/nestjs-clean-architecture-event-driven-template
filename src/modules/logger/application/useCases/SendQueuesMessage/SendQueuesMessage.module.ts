import { Module } from '@nestjs/common';

import { ElasticAdapterModule } from '@shared/adapters/repository/elastic/elastic.module';

import { SendQueuesMessageUseCase } from './SendQueuesMessage.usecase';
import { CreateLogController } from './SendQueuesMessage.controller';

@Module({
  imports: [ElasticAdapterModule],
  providers: [CreateLogController, SendQueuesMessageUseCase],
  exports: [CreateLogController],
})
export class CreateOrderModule {}
