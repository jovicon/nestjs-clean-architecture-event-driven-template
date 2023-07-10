import { Injectable } from '@nestjs/common';
import { Order } from './order.schema';
import { OrderRepositoryAdapter } from './order.adapter';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepositoryAdapter) {}

  getAllOrders(): Promise<Order[]> {
    return this.orderRepository.orders.findAll();
  }

  getOrderById(id: any): Promise<Order> {
    return this.orderRepository.orders.find(id);
  }

  async createOrder(order: Order): Promise<Order> {
    return this.orderRepository.orders.create(order);
  }
}
