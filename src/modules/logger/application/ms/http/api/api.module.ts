import { Module } from '@nestjs/common';

import { CreateOrderModule } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.module';

import { ApiController } from './api.controller';
import { ClientsService as ApiService } from './api.service';

@Module({
  imports: [CreateOrderModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class LoggerModule {}
