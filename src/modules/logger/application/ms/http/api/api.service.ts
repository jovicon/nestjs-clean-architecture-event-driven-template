import { Injectable } from '@nestjs/common';

import { CreateLogController } from '../../../useCases/SendQueuesMessage/SendQueuesMessage.controller';
import { CreateLogDTO } from '../../../useCases/SendQueuesMessage/SendQueuesMessage.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly createLogController: CreateLogController) {}

  async createLog(dto: CreateLogDTO): Promise<any> {
    const useCase = await this.createLogController.execute(dto);

    return {
      ...useCase,
    };
  }
}
