import { Injectable } from '@nestjs/common';

import { CreateOrderUseCase } from '@modules/order/application/useCases/CreateOrder/CreateOrder.usecase';
import {
  CreateOrderDTO,
  CreateOrderUseCaseResponse,
} from '@modules/order/application/useCases/CreateOrder/CreateOrder.dto';

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
