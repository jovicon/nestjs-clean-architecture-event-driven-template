import type { CreateOrderDTO } from '@modules/order/application/ports/orderService.port';
import type { CreateProductUseCaseResponse } from '@modules/products/application/useCases/CreateProduct.usecase';

import { Injectable } from '@nestjs/common';

import { CreateProductUseCase } from '@modules/products/application/useCases/CreateProduct.usecase';

@Injectable()
export default class ClientsService {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  async createProduct(dto: CreateOrderDTO): CreateProductUseCaseResponse {
    const useCase = await this.createProductUseCase.execute(dto);

    return {
      ...useCase,
    };
  }
}
