import { Module } from '@nestjs/common';

import { RequestContextModule } from 'nestjs-request-context';
import { ApiController } from './api.controller';
import ClientsService from './api.service';
import { CreateOrderModule } from '../../useCases/CreateOrder/CreateOrder.module';

@Module({
  imports: [RequestContextModule, CreateOrderModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
