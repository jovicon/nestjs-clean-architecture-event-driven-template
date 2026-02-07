import { ProductInfrastructureModule } from '@modules/products/infrastructure/product.module';

import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import ClientsService from './api.service';

@Module({
  imports: [ProductInfrastructureModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class ProductModule {}
