import { Injectable } from '@nestjs/common';
import { Responses } from '@shared/application/interfaces/responses';

import { CreateLogController } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.controller';
import {
  CreateLogDTO,
  CreateLogUseCaseResponse,
} from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly createLogController: CreateLogController) {}

  async createLog(dto: CreateLogDTO): Promise<Responses<CreateLogUseCaseResponse>> {
    const useCase = await this.createLogController.execute(dto);

    return {
      ...useCase,
    };
  }
}
