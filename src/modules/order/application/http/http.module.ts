import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import routes from './http.routes';
import { CoreModule } from './core/core.module';
import { FormulaOneModule } from './api/api.module';

import { Logger } from './config/logger';

@Module({
  imports: [CoreModule, FormulaOneModule, RouterModule.register(routes), Logger],
})
export class HttpModule {}
