import { OrderInfrastructureModule } from '@modules/order/infrastructure/order.module';

import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import ClientsService from './api.service';

@Module({
  imports: [OrderInfrastructureModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
