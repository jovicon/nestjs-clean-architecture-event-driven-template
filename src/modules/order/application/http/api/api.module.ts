import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import ClientsService from './api.service';
import { CreateOrderModule } from '../../useCases/CreateOrder/CreateOrder.module';

@Module({
  imports: [CreateOrderModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
