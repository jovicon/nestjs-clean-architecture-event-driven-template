import { Module } from '@nestjs/common';

import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@config/config.module';

import { Logger } from '@modules/logger/application/ms/config/logger';

import { LoggerController } from './tcp.controller';

import { CreateOrderModule } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.module';

@Module({
  imports: [RequestContextModule, ConfigModule, CreateOrderModule, Logger],
  controllers: [LoggerController],
})
export class TcpModule {}
