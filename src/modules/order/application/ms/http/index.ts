import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { PATH_BASE_MS, PORT, CORS_CONFIG, SERVICE_NAME } from './http.config';
import { HttpModule } from './http.module';

async function httpServerBootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(HttpModule, { cors: CORS_CONFIG });
    const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(winstonLogger);
    app.use(helmet());

    const config = new DocumentBuilder()
      .setTitle(SERVICE_NAME)
      .setDescription(`${SERVICE_NAME} API description & documentation`)
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT, () => {
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
      winstonLogger.log(`| SERVICE: ${SERVICE_NAME}', 'httpServerBootstrap`);
      winstonLogger.log('| WEB SERVER - REST API OK', 'httpServerBootstrap');
      winstonLogger.log(`| PATH BASE: ${PATH_BASE_MS}`, 'httpServerBootstrap');
      winstonLogger.log(`| RUNNING PORT: ${PORT}`, 'httpServerBootstrap');
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
      winstonLogger.log(`| Swagger path: /${PATH_BASE_MS}/api`, 'httpServerBootstrap');
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
    });
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

(async () => {
  httpServerBootstrap();
})();
