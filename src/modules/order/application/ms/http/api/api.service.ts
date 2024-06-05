import { Injectable } from '@nestjs/common';

import { CreateOrderController } from '../../../useCases/CreateOrder/CreateOrder.controller';
import { CreateOrderDTO, CreateOrderUseCaseResponse } from '../../../useCases/CreateOrder/CreateOrder.dto';

@Injectable()
export default class ClientsService {
  constructor(private readonly createOrderController: CreateOrderController) {}

  async createOrder(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    const useCase = await this.createOrderController.execute(dto);

    return {
      ...useCase,
    };
  }
}
