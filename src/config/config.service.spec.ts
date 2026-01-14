import { ConfigService } from './config.service';
import { DataBaseConfig } from './providers/database.config';
import { LoggerModuleConfig } from './providers/logger.module.config';
import { MicroserviceConfig } from './providers/microservice.config';

jest.mock('./providers/database.config');
jest.mock('./providers/logger.module.config');
jest.mock('./providers/microservice.config');

describe('ConfigService', () => {
  const mockDatabaseConfig = {
    mongoUrl: 'mongodb://localhost:27017/test',
  };

  const mockLoggerConfig = {
    loggerHost: 'localhost',
    loggerPort: 3000,
    elasticHost: 'es-host',
    elasticPort: 9200,
    elasticUsername: 'elastic',
    elasticPassword: 'changeme',
    elasticIndex: 'logs',
  };

  const mockMicroserviceConfig = {
    microserviceVersion: '1.0.0',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a ConfigService instance with all providers', async () => {
      // Mock the static create methods of each config provider
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      const configService = await ConfigService.create({
        envFilePath: '.env',
        packageJsonPath: 'package.json',
      });

      expect(DataBaseConfig.create).toHaveBeenCalledWith('.env');
      expect(LoggerModuleConfig.create).toHaveBeenCalledWith('.env');
      expect(MicroserviceConfig.create).toHaveBeenCalledWith('package.json');
      expect(configService).toBeInstanceOf(ConfigService);
      expect(console.log).toHaveBeenCalledWith('[ConfigService] - constructor init: OK');
    });

    it('should initialize providers property with all configs', async () => {
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      const configService = await ConfigService.create({
        envFilePath: '.env',
        packageJsonPath: 'package.json',
      });

      expect(configService.providers).toBeDefined();
      expect(configService.providers.database).toBe(mockDatabaseConfig);
      expect(configService.providers.loggerModule).toBe(mockLoggerConfig);
      expect(configService.providers.microservice).toBe(mockMicroserviceConfig);
    });

    it('should use custom file paths when provided', async () => {
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      await ConfigService.create({
        envFilePath: './custom/.env',
        packageJsonPath: './custom/package.json',
      });

      expect(DataBaseConfig.create).toHaveBeenCalledWith('./custom/.env');
      expect(LoggerModuleConfig.create).toHaveBeenCalledWith('./custom/.env');
      expect(MicroserviceConfig.create).toHaveBeenCalledWith('./custom/package.json');
    });

    it('should handle database config creation failure', async () => {
      const error = new Error('Database config failed');
      (DataBaseConfig.create as jest.Mock).mockRejectedValue(error);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      await expect(
        ConfigService.create({
          envFilePath: '.env',
          packageJsonPath: 'package.json',
        }),
      ).rejects.toThrow('Database config failed');
    });

    it('should handle logger config creation failure', async () => {
      const error = new Error('Logger config failed');
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockRejectedValue(error);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      await expect(
        ConfigService.create({
          envFilePath: '.env',
          packageJsonPath: 'package.json',
        }),
      ).rejects.toThrow('Logger config failed');
    });

    it('should handle microservice config creation failure', async () => {
      const error = new Error('Microservice config failed');
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockRejectedValue(error);

      await expect(
        ConfigService.create({
          envFilePath: '.env',
          packageJsonPath: 'package.json',
        }),
      ).rejects.toThrow('Microservice config failed');
    });
  });

  describe('providers property', () => {
    it('should provide access to database configuration', async () => {
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      const configService = await ConfigService.create({
        envFilePath: '.env',
        packageJsonPath: 'package.json',
      });

      expect(configService.providers.database.mongoUrl).toBe('mongodb://localhost:27017/test');
    });

    it('should provide access to logger module configuration', async () => {
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      const configService = await ConfigService.create({
        envFilePath: '.env',
        packageJsonPath: 'package.json',
      });

      expect(configService.providers.loggerModule.loggerHost).toBe('localhost');
      expect(configService.providers.loggerModule.loggerPort).toBe(3000);
      expect(configService.providers.loggerModule.elasticHost).toBe('es-host');
    });

    it('should provide access to microservice configuration', async () => {
      (DataBaseConfig.create as jest.Mock).mockResolvedValue(mockDatabaseConfig);
      (LoggerModuleConfig.create as jest.Mock).mockResolvedValue(mockLoggerConfig);
      (MicroserviceConfig.create as jest.Mock).mockResolvedValue(mockMicroserviceConfig);

      const configService = await ConfigService.create({
        envFilePath: '.env',
        packageJsonPath: 'package.json',
      });

      expect(configService.providers.microservice.microserviceVersion).toBe('1.0.0');
    });
  });
});
