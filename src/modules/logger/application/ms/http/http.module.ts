import { ConfigModule } from '@config/config.module';
import { Logger } from '@modules/logger/application/ms/config/logger';
import { Module } from '@nestjs/common';

import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ContextInterceptor } from '@shared/application/context/ContextInterceptor';

import { RequestContextModule } from 'nestjs-request-context';

import { LoggerModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import routes from './http.routes';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

@Module({
  imports: [RequestContextModule, ConfigModule, CoreModule, LoggerModule, RouterModule.register(routes), Logger],
  providers: [...interceptors],
})
export class HttpModule {}
