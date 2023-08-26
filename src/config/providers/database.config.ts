import { readFile } from 'fs/promises';
import { parse } from 'dotenv';
import { EnvConfig, IDatabaseConfig } from '@config/config.types';

export class DataBaseConfig implements IDatabaseConfig {
  private readonly envConfig: EnvConfig;

  constructor(file: Buffer) {
    this.envConfig = parse(file);
    console.log(`[${this.constructor.name}] - constructor init: OK`);
  }

  public static async create(filePath: string): Promise<DataBaseConfig> {
    const file = await readFile(filePath);
    return new DataBaseConfig(file);
  }

  get mongoUrl(): string {
    return this.envConfig.MONGO_URL;
  }
}
