import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateLogUseCase } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.usecase';

import { CreateLogDTO } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';

@Controller()
export class LoggerController {
  constructor(private readonly createLogUseCase: CreateLogUseCase) {}

  @MessagePattern('createdOrder')
  async executeLogger(data: CreateLogDTO): Promise<void> {
    console.log('LoggerController - executeLogger data: ', data);
    await this.createLogUseCase.execute(data);
  }
}
