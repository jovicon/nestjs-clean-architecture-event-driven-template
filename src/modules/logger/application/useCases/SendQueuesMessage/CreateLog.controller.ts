import { Injectable } from '@nestjs/common';
import { Responses } from '@base/src/shared/application/interfaces/responses';

import { CreateLogUseCase } from './CreateLog.usecase';
import { CreateLogDTO, CreateLogUseCaseResponse } from './CreateLog.dto';

@Injectable()
export class CreateLogController {
  constructor(private readonly createLogUseCase: CreateLogUseCase) {}

  async execute(dto: CreateLogDTO): Promise<Responses<CreateLogUseCaseResponse>> {
    return this.createLogUseCase.execute(dto);
  }
}
