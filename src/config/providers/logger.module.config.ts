import { readFile } from 'fs/promises';
import { parse } from 'dotenv';
import { EnvConfig, ILoggerModuleConfig } from '@config/config.types';

export class LoggerModuleConfig implements ILoggerModuleConfig {
  private readonly envConfig: EnvConfig;

  constructor(file: Buffer) {
    this.envConfig = parse(file);

    console.log(`[${this.constructor.name}] - constructor init: OK`);
  }

  public static async create(filePath: string): Promise<LoggerModuleConfig> {
    const file = await readFile(filePath);
    return new LoggerModuleConfig(file);
  }

  get loggerHost(): string {
    return this.envConfig.LOGGER_HOST;
  }

  get loggerPort(): number {
    return +this.envConfig.LOGGER_PORT;
  }

  get elasticHost(): string {
    return this.envConfig.ELASTICSEARCH_HOST;
  }

  get elasticPort(): number {
    return +this.envConfig.ELASTICSEARCH_PORT;
  }

  get elasticUsername(): string {
    return this.envConfig.ELASTICSEARCH_USERNAME;
  }

  get elasticPassword(): string {
    return this.envConfig.ELASTICSEARCH_PASSWORD;
  }

  get elasticIndex(): string {
    return this.envConfig.ELASTICSEARCH_INDEX;
  }
}
