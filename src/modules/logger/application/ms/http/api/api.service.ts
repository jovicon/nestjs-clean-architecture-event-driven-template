import { Injectable } from '@nestjs/common';
import { Responses } from '@shared/application/interfaces/responses';

import { CreateLogUseCase } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.usecase';
import {
  CreateLogDTO,
  CreateLogUseCaseResponse,
} from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly createLogUseCase: CreateLogUseCase) {}

  async createLog(dto: CreateLogDTO): Promise<Responses<CreateLogUseCaseResponse>> {
    const useCase = await this.createLogUseCase.execute(dto);

    return {
      ...useCase,
    };
  }
}
