import { Injectable } from '@nestjs/common';
import { HttpResponse } from '@base/src/shared/application/interfaces/http';

import { CreateLogUseCase } from './CreateLog.usecase';
import { CreateLogDTO, CreateLogUseCaseResponse } from './CreateLog.dto';

@Injectable()
export class CreateLogController {
  constructor(private readonly createLogUseCase: CreateLogUseCase) {}

  async execute(dto: CreateLogDTO): Promise<HttpResponse<CreateLogUseCaseResponse>> {
    return this.createLogUseCase.execute(dto);
  }
}
