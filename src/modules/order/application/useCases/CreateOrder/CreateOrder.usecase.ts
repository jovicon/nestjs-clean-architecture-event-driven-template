import { Injectable } from '@nestjs/common';

import { UseCase } from '@shared/commons/core/UseCase';
import { StatusValues } from '@shared/application/types/status';

import { RequestContextService } from '@shared/application/context/AppRequestContext';

import { Order } from '@modules/order/domain/order';
import { OrderItem } from '@modules/order/domain/orderItem';

import { OrderService } from '@modules/order/adapters/repository/order.service';

import { CreateOrderDTO, CreateOrderUseCaseResponse } from './CreateOrder.dto';

@Injectable()
export class CreateOrderUseCase implements UseCase<CreateOrderDTO, CreateOrderUseCaseResponse> {
  private readonly useCaseName = this.constructor.name;

  private readonly log = (logMessage: string, ...args: string[]) =>
    console.log(`[${this.useCaseName}]-[${RequestContextService.getRequestId()}]: ${logMessage}`, ...args);

  private readonly success = {
    status: StatusValues.SUCCESS,
    message: 'created order successfully',
  };

  private readonly error = {
    status: StatusValues.ERROR,
    message: 'error creating order',
  };

  constructor(private readonly orderService: OrderService) {}

  public async execute(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    try {
      const { items } = dto;

      this.log('dto', JSON.stringify(dto));

      const itemsOrError = items.map((item) => OrderItem.create({ value: item }).getValue());

      const order = Order.create({ items: itemsOrError });

      const orderValidated = order.getValue().toJson();

      const orders = orderValidated.items.map((item) => item.value);

      this.orderService.createOrder({ items: orders }, order.getValue());

      return {
        status: this.success.status,
        message: this.success.message,
        data: {
          orderValidated,
        },
      };
    } catch (err) {
      return {
        status: this.error.status,
        message: this.error.message,
        data: {
          error: err.message,
        },
      };
    }
  }
}
