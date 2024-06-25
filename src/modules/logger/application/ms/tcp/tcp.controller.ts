import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateLogController } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.controller';

import { CreateLogDTO } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';

@Controller()
export class LoggerController {
  constructor(private readonly createLogController: CreateLogController) {}

  @MessagePattern('createdOrder')
  async executeLogger(data: CreateLogDTO): Promise<void> {
    console.log('LoggerController - executeLogger data: ', data);
    await this.createLogController.execute(data);
  }
}
