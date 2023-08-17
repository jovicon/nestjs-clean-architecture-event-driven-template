import { Injectable } from '@nestjs/common';
import { SendQueuesMessageUseCase } from './SendQueuesMessage.usecase';
import { CreateOrderDTO } from './SendQueuesMessage.dto';

@Injectable()
export class CreateOrderController {
  constructor(private readonly getSeasonByYearUseCase: SendQueuesMessageUseCase) {}

  async execute(dto: CreateOrderDTO): Promise<any> {
    return this.getSeasonByYearUseCase.execute();
  }
}
