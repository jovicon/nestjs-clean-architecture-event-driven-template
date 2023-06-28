import { Module } from '@nestjs/common';

import { FormulaOneHttpModule } from '../../../adapters/http/axios.module';

import { GetSeasonByYearUseCase } from './GetSeasonByYear.usecase';
import { GetSeasonByYearController } from './GetSeasonByYear.controller';

@Module({
  imports: [FormulaOneHttpModule],
  providers: [GetSeasonByYearController, GetSeasonByYearUseCase],
  exports: [GetSeasonByYearController],
})
export class GetSeasonByYearModule {}
