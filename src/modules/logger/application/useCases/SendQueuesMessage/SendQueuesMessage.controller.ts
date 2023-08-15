import { Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from './SendQueuesMessage.usecase';
import { CreateOrderDTO } from './SendQueuesMessage.dto';

@Injectable()
export class CreateOrderController {
  constructor(private readonly getSeasonByYearUseCase: CreateOrderUseCase) {}

  async execute(dto: CreateOrderDTO): Promise<any> {
    return this.getSeasonByYearUseCase.execute(dto);
  }
}
