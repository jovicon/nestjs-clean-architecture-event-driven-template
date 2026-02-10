import type { OnApplicationBootstrap } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { Model } from 'mongoose'
import type { OrderDocument } from './order.schema'

import { InjectModel } from '@nestjs/mongoose'

import { MongoRepositoryService } from '@shared/adapters/repository/mongoose/mongoose.service'
import { Order } from './order.schema'

@Injectable()
export class OrderDataSource implements OnApplicationBootstrap {
  orders: MongoRepositoryService<Order>

  constructor(
    @InjectModel(Order.name)
    private readonly orderMongoRepository: Model<OrderDocument>,
  ) {}

  onApplicationBootstrap() {
    this.orders = new MongoRepositoryService<Order>(this.orderMongoRepository as Model<Order>)
  }
}
