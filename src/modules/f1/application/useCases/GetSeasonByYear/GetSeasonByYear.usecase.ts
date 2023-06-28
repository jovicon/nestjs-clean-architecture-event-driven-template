import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/core/UseCase';

import { F1 } from '../../../domain/f1';
import { FormulaOneHttpAdapter } from '../../../adapters/http/axios.adapter';
import { F1SeasonYear } from '../../../domain/f1SeasonYear';

import { GetSeasonByYearDTO } from './GetSeasonByYear.dto';

@Injectable()
export class GetSeasonByYearUseCase implements UseCase<GetSeasonByYearDTO, Promise<any>> {
  constructor(private readonly foneHttpAdapter: FormulaOneHttpAdapter) {}

  public async execute(dto: GetSeasonByYearDTO): Promise<any> {
    try {
      const { year } = dto;

      const idOrError = F1SeasonYear.create({ value: year });

      const f1Year: F1SeasonYear = idOrError.getValue();

      const f1 = F1.create({ season: year, seasonYear: f1Year });

      const f1ValuesValidated = f1.getValue().toJson();

      const { data: season } = await this.foneHttpAdapter.getF1SeasonByYear(f1ValuesValidated.season);

      return {
        status: 'success',
        message: 'got season',
        data: {
          seasonYear: year,
          season,
        },
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: 'error getting season',
        data: {
          error: err.message,
        },
      };
    }
  }
}
