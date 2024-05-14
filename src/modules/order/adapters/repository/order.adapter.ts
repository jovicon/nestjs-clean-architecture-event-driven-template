import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongoRepositoryService } from '@shared/adapters/repository/mongoose/mongoose.service';

import { OrderDocument, Order } from './order.schema';

@Injectable()
export class OrderRepositoryAdapter implements OnApplicationBootstrap {
  orders: MongoRepositoryService<Order>;

  constructor(
    @InjectModel(Order.name)
    private orderRepository: Model<OrderDocument>
  ) {}

  onApplicationBootstrap() {
    this.orders = new MongoRepositoryService<Order>(this.orderRepository);
  }
}
