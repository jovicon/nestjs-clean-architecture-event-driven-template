import { Inject, Injectable } from '@nestjs/common';

import { Responses } from '@shared/application/interfaces/responses';
import { StatusValues } from '@shared/application/types/status';
import { UseCase } from '@shared/commons/core/UseCase';

import { CreateOrderDTO, ProductServicePort } from '@modules/products/application/ports/OrderService.port';
import { Order, OrderJson } from '@modules/products/domain/order';
import { OrderItem } from '@modules/products/domain/orderItem';

type CreateOrderSuccess = {
  orderValidated: OrderJson;
};

type CreateOrderError = {
  error: string;
};

export type CreateProductUseCaseResponse = Promise<Responses<CreateOrderSuccess | CreateOrderError>>;

@Injectable()
export class CreateProductUseCase implements UseCase<CreateOrderDTO, CreateProductUseCaseResponse> {
  private readonly success = {
    status: StatusValues.SUCCESS,
    message: 'created order successfully',
  };

  private readonly error = {
    status: StatusValues.ERROR,
    message: 'error creating order',
  };

  constructor(@Inject('ProductServicePort') private readonly productService: ProductServicePort) {}

  public async execute(dto: CreateOrderDTO): CreateProductUseCaseResponse {
    try {
      const { items } = dto;

      const itemsOrError = items.map((item) => OrderItem.create({ value: item }).getValue());

      const order = Order.create({ items: itemsOrError });

      const orderValidated = order.getValue().toJson();

      const orders = orderValidated.items.map((item) => item.value);

      this.productService.createOrder({ items: orders }, order.getValue());

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
