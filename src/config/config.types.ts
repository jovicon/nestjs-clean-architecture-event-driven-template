export interface EnvConfig {
  [key: string]: string;
}

export interface ConfigFactoryParams {
  envFilePath: string;
  packageJsonPath: string;
}

export interface IDatabaseConfig {
  mongoUrl: string;
}

export interface ILoggerModuleConfig {
  loggerHost: string;
  loggerPort: number;
}

export interface IMicroserviceConfig {
  microserviceVersion: string;
  loggerHost: string;
  loggerPort: number;
}

export interface ConfigServices {
  database: IDatabaseConfig;
  microservice: IMicroserviceConfig;
  loggerModule: ILoggerModuleConfig;
}
