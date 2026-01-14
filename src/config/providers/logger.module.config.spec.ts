import { readFile } from 'fs/promises';
import { LoggerModuleConfig } from './logger.module.config';

jest.mock('fs/promises');

describe('LoggerModuleConfig', () => {
  const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a LoggerModuleConfig instance with valid env file', async () => {
      const mockEnvContent = Buffer.from(`
        LOGGER_HOST=localhost
        LOGGER_PORT=3000
        ELASTICSEARCH_HOST=es-host
        ELASTICSEARCH_PORT=9200
        ELASTICSEARCH_USERNAME=elastic
        ELASTICSEARCH_PASSWORD=changeme
        ELASTICSEARCH_INDEX=logs
      `);
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(mockReadFile).toHaveBeenCalledWith('.env');
      expect(config).toBeInstanceOf(LoggerModuleConfig);
      expect(console.log).toHaveBeenCalledWith('[LoggerModuleConfig] - constructor init: OK');
    });

    it('should handle file read errors', async () => {
      const error = new Error('File not found');
      mockReadFile.mockRejectedValue(error);

      await expect(LoggerModuleConfig.create('.env')).rejects.toThrow('File not found');
    });
  });

  describe('loggerHost getter', () => {
    it('should return the correct LOGGER_HOST from env config', async () => {
      const mockEnvContent = Buffer.from('LOGGER_HOST=logger.example.com');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.loggerHost).toBe('logger.example.com');
    });

    it('should return undefined when LOGGER_HOST is not set', async () => {
      const mockEnvContent = Buffer.from('OTHER_VAR=value');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.loggerHost).toBeUndefined();
    });
  });

  describe('loggerPort getter', () => {
    it('should return the correct LOGGER_PORT as number', async () => {
      const mockEnvContent = Buffer.from('LOGGER_PORT=4000');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.loggerPort).toBe(4000);
      expect(typeof config.loggerPort).toBe('number');
    });

    it('should return NaN when LOGGER_PORT is not a valid number', async () => {
      const mockEnvContent = Buffer.from('LOGGER_PORT=invalid');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.loggerPort).toBeNaN();
    });

    it('should return NaN when LOGGER_PORT is not set', async () => {
      const mockEnvContent = Buffer.from('OTHER_VAR=value');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.loggerPort).toBeNaN();
    });
  });

  describe('elasticHost getter', () => {
    it('should return the correct ELASTICSEARCH_HOST from env config', async () => {
      const mockEnvContent = Buffer.from('ELASTICSEARCH_HOST=es.example.com');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticHost).toBe('es.example.com');
    });

    it('should return undefined when ELASTICSEARCH_HOST is not set', async () => {
      const mockEnvContent = Buffer.from('OTHER_VAR=value');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticHost).toBeUndefined();
    });
  });

  describe('elasticPort getter', () => {
    it('should return the correct ELASTICSEARCH_PORT as number', async () => {
      const mockEnvContent = Buffer.from('ELASTICSEARCH_PORT=9200');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticPort).toBe(9200);
      expect(typeof config.elasticPort).toBe('number');
    });

    it('should return NaN when ELASTICSEARCH_PORT is not a valid number', async () => {
      const mockEnvContent = Buffer.from('ELASTICSEARCH_PORT=invalid');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticPort).toBeNaN();
    });
  });

  describe('elasticUsername getter', () => {
    it('should return the correct ELASTICSEARCH_USERNAME from env config', async () => {
      const mockEnvContent = Buffer.from('ELASTICSEARCH_USERNAME=elastic_user');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticUsername).toBe('elastic_user');
    });

    it('should return undefined when ELASTICSEARCH_USERNAME is not set', async () => {
      const mockEnvContent = Buffer.from('OTHER_VAR=value');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticUsername).toBeUndefined();
    });
  });

  describe('elasticPassword getter', () => {
    it('should return the correct ELASTICSEARCH_PASSWORD from env config', async () => {
      const mockEnvContent = Buffer.from('ELASTICSEARCH_PASSWORD=secret123');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticPassword).toBe('secret123');
    });

    it('should return undefined when ELASTICSEARCH_PASSWORD is not set', async () => {
      const mockEnvContent = Buffer.from('OTHER_VAR=value');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticPassword).toBeUndefined();
    });

    it('should handle empty ELASTICSEARCH_PASSWORD', async () => {
      const mockEnvContent = Buffer.from('ELASTICSEARCH_PASSWORD=');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticPassword).toBe('');
    });
  });

  describe('elasticIndex getter', () => {
    it('should return the correct ELASTICSEARCH_INDEX from env config', async () => {
      const mockEnvContent = Buffer.from('ELASTICSEARCH_INDEX=app-logs-prod');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticIndex).toBe('app-logs-prod');
    });

    it('should return undefined when ELASTICSEARCH_INDEX is not set', async () => {
      const mockEnvContent = Buffer.from('OTHER_VAR=value');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.elasticIndex).toBeUndefined();
    });
  });

  describe('integration - all getters', () => {
    it('should parse and return all logger configuration values correctly', async () => {
      const mockEnvContent = Buffer.from(`
        LOGGER_HOST=logger.prod.com
        LOGGER_PORT=5000
        ELASTICSEARCH_HOST=es.prod.com
        ELASTICSEARCH_PORT=9200
        ELASTICSEARCH_USERNAME=admin
        ELASTICSEARCH_PASSWORD=super_secret
        ELASTICSEARCH_INDEX=production-logs
      `);
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await LoggerModuleConfig.create('.env');

      expect(config.loggerHost).toBe('logger.prod.com');
      expect(config.loggerPort).toBe(5000);
      expect(config.elasticHost).toBe('es.prod.com');
      expect(config.elasticPort).toBe(9200);
      expect(config.elasticUsername).toBe('admin');
      expect(config.elasticPassword).toBe('super_secret');
      expect(config.elasticIndex).toBe('production-logs');
    });
  });
});
