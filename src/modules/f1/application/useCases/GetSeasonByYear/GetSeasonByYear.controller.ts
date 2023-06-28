import { Injectable } from '@nestjs/common';
import { GetSeasonByYearUseCase } from './GetSeasonByYear.usecase';
import { GetSeasonByYearDTO } from './GetSeasonByYear.dto';

@Injectable()
export class GetSeasonByYearController {
  constructor(private readonly getSeasonByYearUseCase: GetSeasonByYearUseCase) {}

  async execute(dto: GetSeasonByYearDTO): Promise<any> {
    return this.getSeasonByYearUseCase.execute(dto);
  }
}
