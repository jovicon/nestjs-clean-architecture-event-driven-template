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

export interface IMicroserviceConfig {
  microserviceVersion: string;
}

export interface ConfigServices {
  database: IDatabaseConfig;
  microservice: IMicroserviceConfig;
}
