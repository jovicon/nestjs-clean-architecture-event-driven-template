import { Module } from '@nestjs/common';

import { CreateOrderModule } from '@modules/products/application/useCases/CreateProduct/CreateProduct.module';

import { ApiController } from './api.controller';
import ClientsService from './api.service';

@Module({
  imports: [CreateOrderModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
