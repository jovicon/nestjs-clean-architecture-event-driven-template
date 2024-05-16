import { Injectable } from '@nestjs/common';
import { HttpResponse } from '@base/src/shared/application/interfaces/http';

import { CreateLogController } from '../../../useCases/SendQueuesMessage/CreateLog.controller';
import { CreateLogDTO, CreateLogUseCaseResponse } from '../../../useCases/SendQueuesMessage/CreateLog.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly createLogController: CreateLogController) {}

  async createLog(dto: CreateLogDTO): Promise<HttpResponse<CreateLogUseCaseResponse>> {
    const useCase = await this.createLogController.execute(dto);

    return {
      ...useCase,
    };
  }
}
