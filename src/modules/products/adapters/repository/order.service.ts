import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Order } from './order.schema';
import { OrderRepositoryAdapter } from './order.adapter';

import { Order as OrderEntity } from '@modules/order/domain/order';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryAdapter,
    protected readonly eventEmitter: EventEmitter2
  ) {}

  getAllOrders(): Promise<Order[]> {
    return this.orderRepository.orders.findAll();
  }

  getOrderById(id: string): Promise<Order> {
    return this.orderRepository.orders.find(id);
  }

  // TODO: Schema and Entity in the same parameter
  // TODO: ID from ID REQUEST
  // TODO: Logger to Publish Events
  async createOrder(order: Order, entity: OrderEntity): Promise<Order> {
    const queryResult = await this.orderRepository.orders.create(order);
    entity.publishEvents(this.eventEmitter);

    return queryResult;
  }
}
