import { Module } from '@nestjs/common';
import { RouterModule, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';

import { ContextInterceptor } from '@shared/application/context/ContextInterceptor';

import { OrderCreatedEventHandler } from '@modules/order/domain/events/handlers/orderCreated.handler';

import { allRoutes } from './http.routes';
import { CoreModule } from './core/core.module';
import { OrderModule } from './api/api.module';

import { Logger } from './config/logger';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

const loggerMicroserviceProvider = {
  provide: 'LOGGER_SERVICE',
  useFactory: (configService: ConfigService) =>
    ClientProxyFactory.create({
      options: {
        host: configService.providers.loggerModule.loggerHost,
        port: configService.providers.loggerModule.loggerPort,
      },
      transport: Transport.TCP,
    }),
  inject: [ConfigService],
};

@Module({
  imports: [RequestContextModule, ConfigModule, CoreModule, OrderModule, RouterModule.register(allRoutes), Logger],
  providers: [...interceptors, OrderCreatedEventHandler, loggerMicroserviceProvider],
})
export class HttpModule {}
