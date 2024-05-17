import { Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from './CreateOrder.usecase';
import { CreateOrderDTO, CreateOrderUseCaseResponse } from './CreateOrder.dto';

@Injectable()
export class CreateOrderController {
  constructor(private readonly getSeasonByYearUseCase: CreateOrderUseCase) {}

  async execute(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    return this.getSeasonByYearUseCase.execute(dto);
  }
}
