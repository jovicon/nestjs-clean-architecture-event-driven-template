import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import ClientsService from './api.service';
import { CreateOrderModule } from '@modules/products/application/useCases/CreateProduct/CreateProduct.module';

@Module({
  imports: [CreateOrderModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
