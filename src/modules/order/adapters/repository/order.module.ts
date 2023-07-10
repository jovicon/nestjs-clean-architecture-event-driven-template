import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Order } from './order.schema';

import { OrderRepositoryAdapter } from './order.adapter';
import { OrderService } from './order.service';

const mongoConnectionUrl = 'mongodb://root:example@localhost:27017/';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forRoot(mongoConnectionUrl),
  ],
  providers: [OrderRepositoryAdapter, OrderService],
  exports: [OrderService],
})
export class OrderRepositoryModule {}
