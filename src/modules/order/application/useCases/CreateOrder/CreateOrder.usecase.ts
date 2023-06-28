import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/core/UseCase';

import { Order } from '../../../domain/order';
import { FormulaOneHttpAdapter } from '../../../adapters/http/axios.adapter';
import { OrderItem } from '../../../domain/orderItem';

import { CreateOrderDTO } from './CreateOrder.dto';

@Injectable()
export class GetSeasonByYearUseCase implements UseCase<CreateOrderDTO, Promise<any>> {
  constructor(private readonly foneHttpAdapter: FormulaOneHttpAdapter) {}

  public async execute(dto: CreateOrderDTO): Promise<any> {
    try {
      const { items } = dto;

      console.log('items', items);

      const itemsOrError = items.map((item) => OrderItem.create({ value: item }).getValue());

      const order = Order.create({ items: itemsOrError });

      const orderValidated = order.getValue().toJson();

      return {
        status: 'success',
        message: 'got season',
        data: {
          orderValidated,
        },
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: 'error getting season',
        data: {
          error: err.message,
        },
      };
    }
  }
}
