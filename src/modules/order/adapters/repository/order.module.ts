import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';

import { OrderRepositoryAdapter } from './order.adapter';
import { Order, OrderSchema } from './order.schema';
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
  exports: [OrderService, OrderRepositoryAdapter],
})
export class OrderRepositoryModule {}
