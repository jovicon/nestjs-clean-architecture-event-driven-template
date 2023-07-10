import { Module } from '@nestjs/common';

import { OrderRepositoryModule } from '../../../adapters/repository/order.module';
import { FormulaOneHttpModule } from '../../../adapters/http/axios.module';

import { GetSeasonByYearUseCase } from './CreateOrder.usecase';
import { GetSeasonByYearController } from './CreateOrder.controller';

@Module({
  imports: [FormulaOneHttpModule, OrderRepositoryModule],
  providers: [GetSeasonByYearController, GetSeasonByYearUseCase],
  exports: [GetSeasonByYearController],
})
export class CreateOrderModule {}
