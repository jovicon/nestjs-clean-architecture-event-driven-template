import { readFile } from 'node:fs/promises';
import { DataBaseConfig } from './database.config';

jest.mock('fs/promises');

describe('dataBaseConfig', () => {
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
    it('should create a DataBaseConfig instance with valid env file', async () => {
      const mockEnvContent = Buffer.from('MONGO_URL=mongodb://localhost:27017/test');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await DataBaseConfig.create('.env');

      expect(mockReadFile).toHaveBeenCalledWith('.env');
      expect(config).toBeInstanceOf(DataBaseConfig);
      expect(console.log).toHaveBeenCalledWith('[DataBaseConfig] - constructor init: OK');
    });

    it('should handle file read errors', async () => {
      const error = new Error('File not found');
      mockReadFile.mockRejectedValue(error);

      await expect(DataBaseConfig.create('.env')).rejects.toThrow('File not found');
    });
  });

  describe('mongoUrl getter', () => {
    it('should return the correct MONGO_URL from env config', async () => {
      const expectedUrl = 'mongodb://localhost:27017/testdb';
      const mockEnvContent = Buffer.from(`MONGO_URL=${expectedUrl}`);
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await DataBaseConfig.create('.env');

      expect(config.mongoUrl).toBe(expectedUrl);
    });

    it('should return undefined when MONGO_URL is not set', async () => {
      const mockEnvContent = Buffer.from('OTHER_VAR=value');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await DataBaseConfig.create('.env');

      expect(config.mongoUrl).toBeUndefined();
    });

    it('should handle empty MONGO_URL', async () => {
      const mockEnvContent = Buffer.from('MONGO_URL=');
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await DataBaseConfig.create('.env');

      expect(config.mongoUrl).toBe('');
    });

    it('should parse env file with multiple variables', async () => {
      const mockEnvContent = Buffer.from(`
        OTHER_VAR=test
        MONGO_URL=mongodb://prod:27017/app
        ANOTHER_VAR=123
      `);
      mockReadFile.mockResolvedValue(mockEnvContent);

      const config = await DataBaseConfig.create('.env');

      expect(config.mongoUrl).toBe('mongodb://prod:27017/app');
    });
  });
});
