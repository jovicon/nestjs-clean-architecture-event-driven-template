import { Module } from '@nestjs/common';

import { HttpAdapterModule } from '@shared/adapters/http/axios/http.module';
import { FormulaOneHttpAdapter } from './axios.adapter';

@Module({
  imports: [HttpAdapterModule],
  providers: [FormulaOneHttpAdapter],
  exports: [FormulaOneHttpAdapter],
})
export class FormulaOneHttpModule {}
