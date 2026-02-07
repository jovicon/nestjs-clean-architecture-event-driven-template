import type { CreateOrderDTO } from '@modules/order/application/ports/orderService.port';
import type { CreateOrderUseCaseResponse } from '@modules/order/application/useCases/CreateOrder.usecase';

import { Injectable } from '@nestjs/common';

import { CreateOrderUseCase } from '@modules/order/application/useCases/CreateOrder.usecase';

@Injectable()
export default class ClientsService {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  async createOrder(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    const useCase = await this.createOrderUseCase.execute(dto);

    return {
      ...useCase,
    };
  }
}
