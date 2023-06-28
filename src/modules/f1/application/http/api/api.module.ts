import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import ClientsService from './api.service';

import { GetSeasonByYearModule } from '../../useCases/GetSeasonByYear/GetSeasonByYear.module';

@Module({
  imports: [GetSeasonByYearModule],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class FormulaOneModule {}
