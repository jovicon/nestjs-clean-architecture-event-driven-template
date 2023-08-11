import { Module } from '@nestjs/common';
import { RouterModule, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@config/config.module';
import { ContextInterceptor } from '@shared/application/context/ContextInterceptor';

import { OrderSagas } from '../../sagas/orders.sagas';

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
  imports: [
    CqrsModule,
    RequestContextModule,
    ConfigModule,
    CoreModule,
    OrderModule,
    RouterModule.register(routes),
    Logger,
  ],
  providers: [...interceptors, OrderSagas],
})
export class HttpModule {}
