import { Module } from '@nestjs/common';

import { FormulaOneHttpModule } from '../../../adapters/http/axios.module';

import { GetSeasonByYearUseCase } from './CreateOrder.usecase';
import { GetSeasonByYearController } from './CreateOrder.controller';

@Module({
  imports: [FormulaOneHttpModule],
  providers: [GetSeasonByYearController, GetSeasonByYearUseCase],
  exports: [GetSeasonByYearController],
})
export class CreateOrderModule {}
