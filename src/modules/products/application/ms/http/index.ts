import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { version, name, author } from '@base/package.json';
import { PATH_BASE_MS, PORT, CORS_CONFIG, SERVICE_NAME } from './http.config';
import { HttpModule } from './http.module';

export async function httpServerBootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(HttpModule, { cors: CORS_CONFIG });
    const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(winstonLogger);
    app.use(helmet());

    const config = new DocumentBuilder()
      .setTitle(SERVICE_NAME)
      .setDescription(`${SERVICE_NAME} API description & documentation`)
      .setVersion(version)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT, () => {
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
      winstonLogger.log(`| APP NAME: ${name}', 'httpServerBootstrap`);
      winstonLogger.log(`| AUTHOR: ${author}', 'httpServerBootstrap`);
      winstonLogger.log(`| SERVICE: ${SERVICE_NAME}', 'httpServerBootstrap`);
      winstonLogger.log('| WEB SERVER - REST API OK', 'httpServerBootstrap');
      winstonLogger.log(`| PATH BASE: ${PATH_BASE_MS}`, 'httpServerBootstrap');
      winstonLogger.log(`| RUNNING PORT: ${PORT}`, 'httpServerBootstrap');
      winstonLogger.log(`| VERSION: ${version}`, 'httpServerBootstrap');
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
      winstonLogger.log(`| Swagger path: /${PATH_BASE_MS}/api`, 'httpServerBootstrap');
      winstonLogger.log('|------------------------------------------------------------------|', 'httpServerBootstrap');
    });
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

(async () => {
  await httpServerBootstrap();
})();
