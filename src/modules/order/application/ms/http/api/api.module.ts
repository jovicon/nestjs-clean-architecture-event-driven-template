import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import ClientsService from './api.service';
import { OrderInfrastructureModule } from '@modules/order/infrastructure/order.module';

@Module({
  imports: [OrderInfrastructureModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
