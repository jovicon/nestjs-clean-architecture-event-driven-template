import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { OrderSchema, Order } from './order.schema';

import { OrderRepositoryAdapter } from './order.adapter';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.container.database.mongoUrl,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OrderRepositoryAdapter, OrderService],
  exports: [OrderService],
})
export class OrderRepositoryModule {}
