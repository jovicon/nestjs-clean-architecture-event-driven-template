import { Injectable } from '@nestjs/common';
import { GetSeasonByYearUseCase } from './CreateOrder.usecase';
import { CreateOrderDTO } from './CreateOrder.dto';

@Injectable()
export class GetSeasonByYearController {
  constructor(private readonly getSeasonByYearUseCase: GetSeasonByYearUseCase) {}

  async execute(dto: CreateOrderDTO): Promise<any> {
    return this.getSeasonByYearUseCase.execute(dto);
  }
}
