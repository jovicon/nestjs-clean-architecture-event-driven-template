import { ConfigModule } from '@config/config.module'
import { ConfigService } from '@config/config.service'
import { Module } from '@nestjs/common'

import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { OrderDataSource } from './order.adapter'

import { OrderMapper } from './order.mapper'
import { OrderRepository } from './order.repository'
import { Order, OrderSchema } from './order.schema'

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
  providers: [OrderDataSource, OrderRepository, OrderMapper],
  exports: [OrderRepository, OrderDataSource, OrderMapper],
})
export class OrderRepositoryModule {}
