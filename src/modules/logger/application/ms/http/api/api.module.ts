import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import { ClientsService as ApiService } from './api.service';

import { CreateOrderModule } from '../../../useCases/SendQueuesMessage/SendQueuesMessage.module';

@Module({
  imports: [CreateOrderModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class LoggerModule {}
