import { readFile } from 'fs/promises';
import { IMicroserviceConfig } from '@config/config.types';

export class MicroserviceConfig implements IMicroserviceConfig {
  private readonly envConfig;

  private constructor(file: string) {
    this.envConfig = JSON.parse(file);
    console.log(`[${this.constructor.name}] - constructor init: OK`);
  }

  public static async create(filePath: string): Promise<MicroserviceConfig> {
    const file = await readFile(filePath, 'utf8');
    return new MicroserviceConfig(file);
  }

  get microserviceVersion(): string {
    return this.envConfig.version;
  }
}
