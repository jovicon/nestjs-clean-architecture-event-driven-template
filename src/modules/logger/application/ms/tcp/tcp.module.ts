import { RequestContextModule } from 'nestjs-request-context';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@config/config.module';

import { Logger } from '@modules/logger/application/ms/config/logger';
import { CreateOrderModule } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.module';

import { LoggerController } from './tcp.controller';

@Module({
  imports: [RequestContextModule, ConfigModule, CreateOrderModule, Logger],
  controllers: [LoggerController],
})
export class TcpModule {}
