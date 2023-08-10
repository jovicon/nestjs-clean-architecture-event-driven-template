import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { OrderSchema, Order } from './order.schema';

import { OrderRepositoryAdapter } from './order.adapter';
import { OrderService } from './order.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.providers.database.mongoUrl,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OrderRepositoryAdapter, OrderService],
  exports: [OrderService],
})
export class OrderRepositoryModule {}
