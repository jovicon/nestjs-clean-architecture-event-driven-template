import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/core/UseCase';

import { Order } from '../../../domain/order';
import { OrderRepositoryAdapter } from '../../../adapters/repository/order.adapter';

import { OrderItem } from '../../../domain/orderItem';

import { CreateOrderDTO } from './CreateOrder.dto';

@Injectable()
export class GetSeasonByYearUseCase implements UseCase<CreateOrderDTO, Promise<any>> {
  constructor(private readonly orderRepository: OrderRepositoryAdapter) {}

  public async execute(dto: CreateOrderDTO): Promise<any> {
    try {
      const { items } = dto;

      const itemsOrError = items.map((item) => OrderItem.create({ value: item }).getValue());

      const order = Order.create({ items: itemsOrError });

      const orderValidated = order.getValue().toJson();

      const orders = orderValidated.items.map((item) => item.value);

      console.log('orders: ', orders);

      this.orderRepository.orders.create({ items: orders });

      console.log('orderValidated: ', orderValidated);

      return {
        status: 'success',
        message: 'created order',
        data: {
          orderValidated,
        },
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: 'error creating order',
        data: {
          error: err.message,
        },
      };
    }
  }
}
