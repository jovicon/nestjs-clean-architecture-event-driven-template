import type {
  CreateLogDTO,
  CreateLogUseCaseResponse,
} from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';
import type { Responses } from '@shared/application/interfaces/responses';

import { Injectable } from '@nestjs/common';

import { CreateLogUseCase } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.usecase';

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
