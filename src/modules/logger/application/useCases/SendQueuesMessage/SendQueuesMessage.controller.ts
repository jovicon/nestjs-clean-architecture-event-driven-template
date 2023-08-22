import { Injectable } from '@nestjs/common';
import { SendQueuesMessageUseCase } from './SendQueuesMessage.usecase';
import { CreateLogDTO } from './SendQueuesMessage.dto';

@Injectable()
export class CreateLogController {
  constructor(private readonly sendQueuesMessageUseCase: SendQueuesMessageUseCase) {}

  async execute(dto: CreateLogDTO): Promise<any> {
    return this.sendQueuesMessageUseCase.execute(dto);
  }
}
