import { Module } from '@nestjs/common';
import { RouterModule, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@config/config.module';
import { ContextInterceptor } from '@shared/application/context/ContextInterceptor';

import { OrderCreatedEventHandler } from '../../domain/events/handlers/orderCreated.handler';

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
    ClientsModule.register([{ name: 'LOGGER_SERVICE', options: { host: 'localhost:3001' }, transport: Transport.TCP }]),
    RequestContextModule,
    ConfigModule,
    CoreModule,
    OrderModule,
    RouterModule.register(routes),
    Logger,
  ],
  providers: [...interceptors, OrderCreatedEventHandler],
})
export class HttpModule {}
