import { Injectable } from '@nestjs/common';

import { CreateOrderDTO } from '@modules/order/application/ports/orderService.port';
import { CreateOrderUseCaseResponse } from '@modules/products/application/useCases/CreateProduct/CreateProduct.dto';
import { CreateOrderUseCase } from '@modules/products/application/useCases/CreateProduct/CreateProduct.usecase';

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
