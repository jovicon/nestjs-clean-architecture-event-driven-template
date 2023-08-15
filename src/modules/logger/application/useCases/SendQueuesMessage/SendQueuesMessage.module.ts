import { Module } from '@nestjs/common';

import { SendQueuesMessageUseCase } from './SendQueuesMessage.usecase';
import { CreateOrderController } from './SendQueuesMessage.controller';

@Module({
  imports: [],
  providers: [CreateOrderController, SendQueuesMessageUseCase],
  exports: [CreateOrderController],
})
export class CreateOrderModule {}
