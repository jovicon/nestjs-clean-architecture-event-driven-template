import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestFactory } from '@nestjs/core';
import { HttpModule } from './http.module';

const PATH_BASE_MS = '';
const PORT = 3001;

async function httpServerBootstrap(): Promise<void> {
  try {
    const corsConfig = {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      origin: '*',
      credentials: true,
    };

    const app = await NestFactory.create(HttpModule, { cors: corsConfig });
    const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(winstonLogger);
    app.use(helmet());

    const config = new DocumentBuilder()
      .setTitle('SERVICE NAME')
      .setDescription('SERVICE NAME API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT, () => {
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
      winstonLogger.log('| SERVICE: SERVICE NAME MS', 'httpServerBootstrap');
      winstonLogger.log('| WEB SERVER - REST API OK', 'httpServerBootstrap');
      winstonLogger.log(`| PATH BASE: ${PATH_BASE_MS}`, 'httpServerBootstrap');
      winstonLogger.log(`| RUNNING PORT: ${PORT}`, 'httpServerBootstrap');
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
      winstonLogger.log(`| Swagger path: ${PATH_BASE_MS}/api`, 'httpServerBootstrap');
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
    });
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

(async () => {
  httpServerBootstrap();
})();
