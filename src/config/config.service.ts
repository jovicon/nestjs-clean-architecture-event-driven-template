import { EnvConfig, ConfigServices, ConfigFactoryParams } from './config.types';
import { DataBaseConfig } from './providers/database.config';
import { MicroserviceConfig } from './providers/microservice.config';
import { LoggerModuleConfig } from './providers/logger.module.config';

export class ConfigService {
  private readonly envConfig: EnvConfig;

  readonly providers: ConfigServices;

  private constructor({ database, microservice, loggerModule }: ConfigServices) {
    this.providers = {
      database,
      microservice,
      loggerModule,
    };

    console.log(`[${this.constructor.name}] - constructor init: OK`);
  }

  public static async create({ envFilePath, packageJsonPath }: ConfigFactoryParams): Promise<ConfigService> {
    const database = await DataBaseConfig.create(envFilePath);
    const microservice = await MicroserviceConfig.create(packageJsonPath);
    const loggerModule = await LoggerModuleConfig.create(envFilePath);

    return new ConfigService({ database, microservice, loggerModule });
  }
}
