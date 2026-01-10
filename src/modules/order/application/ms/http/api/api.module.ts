import { Module } from '@nestjs/common';

import { OrderInfrastructureModule } from '@modules/order/infrastructure/order.module';

import { ApiController } from './api.controller';
import ClientsService from './api.service';

@Module({
  imports: [OrderInfrastructureModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
