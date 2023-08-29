import { Injectable } from '@nestjs/common';
import { CreateLogUseCase } from './CreateLog.usecase';
import { CreateLogDTO } from './CreateLog.dto';

@Injectable()
export class CreateLogController {
  constructor(private readonly createLogUseCase: CreateLogUseCase) {}

  async execute(dto: CreateLogDTO): Promise<any> {
    return this.createLogUseCase.execute(dto);
  }
}
