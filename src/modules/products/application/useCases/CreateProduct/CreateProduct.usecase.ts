import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { UseCase } from '@shared/commons/core/UseCase';

import { Order } from '@modules/products/domain/order';
import { OrderItem } from '@modules/products/domain/orderItem';

import { OrderService } from '@modules/products/adapters/repository/order.service';

import { CreateOrderDTO, CreateOrderUseCaseResponse } from './CreateProduct.dto';

@Injectable()
export class CreateOrderUseCase implements UseCase<CreateOrderDTO, CreateOrderUseCaseResponse> {
  private successMessage = 'created order';
  private errorMessage = 'error creating order';

  constructor(
    private readonly orderService: OrderService
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  public async execute(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    try {
      const { items } = dto;

      const itemsOrError = items.map((item) => OrderItem.create({ value: item }).getValue());

      const order = Order.create({ items: itemsOrError });

      const orderValidated = order.getValue().toJson();

      const orders = orderValidated.items.map((item) => item.value);

      this.orderService.createOrder({ items: orders }, order.getValue());

      // await this.cacheManager.set('key', 'value');

      console.log('Example created');

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
