import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/core/UseCase';

import { CreateOrderDTO } from './SendQueuesMessage.dto';

@Injectable()
export class SendQueuesMessageUseCase implements UseCase<CreateOrderDTO, Promise<any>> {
  public async execute(): Promise<any> {
    try {
      return {
        status: 'success',
        message: 'created order',
        data: {},
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: 'error creating order',
        data: {
          error: err.message,
        },
      };
    }
  }
}
