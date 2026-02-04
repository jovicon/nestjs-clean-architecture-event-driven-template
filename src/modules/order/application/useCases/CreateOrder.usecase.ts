import { Inject, Injectable } from '@nestjs/common';

import { RequestContextService } from '@shared/application/context/AppRequestContext';
import { Responses } from '@shared/application/interfaces/responses';
import { StatusValues } from '@shared/application/types/status';
import { UseCase } from '@shared/commons/core/UseCase';

import { Order, OrderJson } from '@modules/order/domain/order';
import { OrderItem } from '@modules/order/domain/orderItem';

import { CreateOrderDTO, OrderServicePort } from '../ports/orderService.port';

type CreateOrderSuccess = {
  orderValidated: OrderJson;
};

type CreateOrderError = {
  error: string;
};

export type CreateOrderUseCaseResponse = Promise<Responses<CreateOrderSuccess | CreateOrderError>>;

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

  constructor(@Inject('OrderServicePort') private readonly orderService: OrderServicePort) {}

  public async execute(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    const { items } = dto;

    this.log('dto', JSON.stringify(dto));

    // ✅ REFACTORED: Create OrderItems with proper Result checking
    const itemResults = items.map((item) => OrderItem.create({ value: item }));

    // ✅ REFACTORED: Check for any failed OrderItem creations
    const failedItems = itemResults.filter((result) => result.isFailure);
    if (failedItems.length > 0) {
      const errors = failedItems.map((result) => result.errorValue()).join(', ');
      this.log('Failed to create order items', errors);
      return {
        status: this.error.status,
        message: this.error.message,
        data: {
          error: `Failed to create order items: ${errors}`,
        },
      };
    }

    // ✅ REFACTORED: Safe to get values now - all Results are successful
    const validItems = itemResults.map((result) => result.getValue());

    // ✅ REFACTORED: Create Order with proper Result checking
    const orderResult = Order.create({ items: validItems });

    if (orderResult.isFailure) {
      const errorMessage = String(orderResult.errorValue() || 'Failed to create order');
      this.log('Failed to create order', errorMessage);
      return {
        status: this.error.status,
        message: this.error.message,
        data: {
          error: errorMessage,
        },
      };
    }

    // ✅ REFACTORED: Safe to get Order value
    const order = orderResult.getValue();
    const orderValidated = order.toJson();
    const orders = orderValidated.items.map((item) => item.value);

    // Persist order
    await this.orderService.createOrder({ items: orders }, order);

    this.log('Order created successfully', JSON.stringify(orderValidated));

    return {
      status: this.success.status,
      message: this.success.message,
      data: {
        orderValidated,
      },
    };
  }
}
