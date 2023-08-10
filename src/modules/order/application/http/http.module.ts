import { Module } from '@nestjs/common';
import { RouterModule, APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '@config/config.module';
import { ContextInterceptor } from '@shared/application/context/ContextInterceptor';

import routes from './http.routes';
import { CoreModule } from './core/core.module';
import { OrderModule } from './api/api.module';

import { Logger } from './config/logger';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

@Module({
  imports: [ConfigModule, CoreModule, OrderModule, RouterModule.register(routes), Logger],
  providers: [...interceptors],
})
export class HttpModule {}
