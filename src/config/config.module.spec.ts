import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

describe('configModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide ConfigService', async () => {
    const configService = await module.resolve(ConfigService);
    expect(configService).toBeDefined();
  });

  it('should be a global module', () => {
    const moduleMetadata = Reflect.getMetadata('__module:global__', ConfigModule);
    expect(moduleMetadata).toBe(true);
  });

  it('should export ConfigService', () => {
    const exports = Reflect.getMetadata('exports', ConfigModule);
    expect(exports).toContain(ConfigService);
  });

  it('should have ConfigService as a provider', () => {
    const providers = Reflect.getMetadata('providers', ConfigModule);
    expect(providers).toBeDefined();
    expect(providers.length).toBeGreaterThan(0);
  });
});
