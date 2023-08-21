import { Module } from '@nestjs/common';

import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@config/config.module';

import { Logger } from '../config/logger';

import { LoggerController } from './tcp.controller';

@Module({
  controllers: [LoggerController],
  imports: [RequestContextModule, ConfigModule, Logger],
})
export class TcpModule {}
