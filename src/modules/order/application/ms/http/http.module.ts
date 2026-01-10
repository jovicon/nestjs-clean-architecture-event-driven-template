import { RequestContextModule } from 'nestjs-request-context';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { ContextInterceptor } from '@shared/application/context/ContextInterceptor';

import { OrderCreatedEventHandler } from '@modules/order/application/events/orderCreated.handler';

import { OrderModule } from './api/api.module';
import { Logger } from './config/logger';
import { CoreModule } from './core/core.module';
import { allRoutes } from './http.routes';

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
