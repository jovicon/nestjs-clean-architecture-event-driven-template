import { Module } from '@nestjs/common';

import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@config/config.module';

import { Logger } from '../config/logger';

import { LoggerController } from './tcp.controller';

import { CreateOrderModule } from '../../useCases/SendQueuesMessage/CreateLog.module';

@Module({
  imports: [RequestContextModule, ConfigModule, CreateOrderModule, Logger],
  controllers: [LoggerController],
})
export class TcpModule {}
