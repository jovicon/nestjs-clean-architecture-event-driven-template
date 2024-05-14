import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateLogController } from '../../useCases/SendQueuesMessage/CreateLog.controller';

@Controller()
export class LoggerController {
  constructor(private readonly createLogController: CreateLogController) {}

  @MessagePattern('createdOrder')
  async executeLogger(data: any): Promise<void> {
    console.log('LoggerController - executeLogger data: ', data);
    await this.createLogController.execute(data);
  }
}
