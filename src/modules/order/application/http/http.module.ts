import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { ConfigModule } from '@config/config.module';

import routes from './http.routes';
import { CoreModule } from './core/core.module';
import { OrderModule } from './api/api.module';

import { Logger } from './config/logger';

@Module({
  imports: [ConfigModule, CoreModule, OrderModule, RouterModule.register(routes), Logger],
})
export class HttpModule {}
