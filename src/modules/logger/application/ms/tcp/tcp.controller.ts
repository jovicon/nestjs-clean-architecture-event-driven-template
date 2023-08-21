import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class LoggerController {
  @MessagePattern('createdOrder')
  executeLogger(data: any): void {
    console.log('LoggerController - executeLogger data: ', data);
  }
}
