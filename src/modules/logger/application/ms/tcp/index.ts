import type { MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { TcpModule } from './tcp.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TcpModule, {
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });
  await app.listen();
}
bootstrap();
