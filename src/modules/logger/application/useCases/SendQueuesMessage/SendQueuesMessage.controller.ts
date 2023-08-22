import { Injectable } from '@nestjs/common';
import { SendQueuesMessageUseCase } from './SendQueuesMessage.usecase';
import { CreateOrderDTO } from './SendQueuesMessage.dto';

@Injectable()
export class CreateOrderController {
  constructor(private readonly sendQueuesMessageUseCase: SendQueuesMessageUseCase) {}

  async execute(dto: CreateOrderDTO): Promise<any> {
    return this.sendQueuesMessageUseCase.execute(dto);
  }
}
