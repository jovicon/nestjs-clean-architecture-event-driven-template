import { EnvConfig, ConfigServices, ConfigFactoryParams } from './config.types';
import { DataBaseConfig } from './providers/database.config';
import { MicroserviceConfig } from './providers/microservice.config';

export class ConfigService {
  private readonly envConfig: EnvConfig;

  readonly providers: ConfigServices;

  constructor({ database, microservice }: ConfigServices) {
    this.providers = {
      database,
      microservice,
    };

    console.log(`[${this.constructor.name}] - constructor init: OK`);
  }

  public static async create({ envFilePath, packageJsonPath }: ConfigFactoryParams): Promise<ConfigService> {
    const database = await DataBaseConfig.create(envFilePath);
    const microservice = await MicroserviceConfig.create(packageJsonPath);

    return new ConfigService({ database, microservice });
  }

  get env(): string {
    return this.envConfig.NODE_ENV;
  }

  get microserviceVersion(): string {
    return this.envConfig.npm_package_version;
  }

  get projectId(): string {
    return this.envConfig.PROJECT_ID;
  }

  get pathBaseMs(): string {
    return this.envConfig.PATH_BASE_MS;
  }

  get port(): number {
    return Number(this.envConfig.NODE_PORT);
  }

  get apiConnectUrl(): string {
    return this.envConfig.API_CONNECT_BASE_URL;
  }
}
