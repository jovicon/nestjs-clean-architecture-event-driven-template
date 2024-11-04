import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/commons/core/UseCase';

import { Order } from '@modules/order/domain/order';
import { OrderItem } from '@modules/order/domain/orderItem';

import { OrderService } from '@modules/order/adapters/repository/order.service';

import { CreateOrderDTO, CreateOrderUseCaseResponse } from './CreateOrder.dto';

@Injectable()
export class CreateOrderUseCase implements UseCase<CreateOrderDTO, CreateOrderUseCaseResponse> {
  private successMessage = 'created order';
  private errorMessage = 'error creating order';

  constructor(private readonly orderService: OrderService) {}

  public async execute(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    try {
      const { items } = dto;

      const itemsOrError = items.map((item) => OrderItem.create({ value: item }).getValue());

      const order = Order.create({ items: itemsOrError });

      const orderValidated = order.getValue().toJson();

      const orders = orderValidated.items.map((item) => item.value);

      this.orderService.createOrder({ items: orders }, order.getValue());

      return {
        status: 'success',
        message: this.successMessage,
        data: {
          orderValidated,
        },
      };
    } catch (err) {
      return {
        status: 'error',
        message: this.errorMessage,
        data: {
          error: err.message,
        },
      };
    }
  }
}
