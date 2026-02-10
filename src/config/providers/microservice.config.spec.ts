import { readFile } from 'node:fs/promises';
import { MicroserviceConfig } from './microservice.config';

jest.mock('fs/promises');

describe('microserviceConfig', () => {
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
    it('should create a MicroserviceConfig instance with valid package.json', async () => {
      const mockPackageJson = JSON.stringify({
        name: 'test-app',
        version: '1.0.0',
      });
      mockReadFile.mockResolvedValue(mockPackageJson);

      const config = await MicroserviceConfig.create('package.json');

      expect(mockReadFile).toHaveBeenCalledWith('package.json', 'utf8');
      expect(config).toBeInstanceOf(MicroserviceConfig);
      expect(console.log).toHaveBeenCalledWith('[MicroserviceConfig] - constructor init: OK');
    });

    it('should handle file read errors', async () => {
      const error = new Error('File not found');
      mockReadFile.mockRejectedValue(error);

      await expect(MicroserviceConfig.create('package.json')).rejects.toThrow('File not found');
    });

    it('should handle invalid JSON', async () => {
      const invalidJson = 'invalid json content {';
      mockReadFile.mockResolvedValue(invalidJson);

      await expect(MicroserviceConfig.create('package.json')).rejects.toThrow();
    });
  });

  describe('microserviceVersion getter', () => {
    it('should return the correct version from package.json', async () => {
      const mockPackageJson = JSON.stringify({
        name: 'test-app',
        version: '2.5.1',
      });
      mockReadFile.mockResolvedValue(mockPackageJson);

      const config = await MicroserviceConfig.create('package.json');

      expect(config.microserviceVersion).toBe('2.5.1');
    });

    it('should return undefined when version is not set', async () => {
      const mockPackageJson = JSON.stringify({
        name: 'test-app',
      });
      mockReadFile.mockResolvedValue(mockPackageJson);

      const config = await MicroserviceConfig.create('package.json');

      expect(config.microserviceVersion).toBeUndefined();
    });

    it('should handle semantic versioning formats', async () => {
      const testCases = [
        { version: '1.0.0', expected: '1.0.0' },
        { version: '1.2.3-alpha.1', expected: '1.2.3-alpha.1' },
        { version: '2.0.0-beta+build.123', expected: '2.0.0-beta+build.123' },
      ];

      for (const testCase of testCases) {
        const mockPackageJson = JSON.stringify({
          version: testCase.version,
        });
        mockReadFile.mockResolvedValue(mockPackageJson);

        const config = await MicroserviceConfig.create('package.json');

        expect(config.microserviceVersion).toBe(testCase.expected);
      }
    });

    it('should parse package.json with multiple fields', async () => {
      const mockPackageJson = JSON.stringify({
        name: '@scope/my-app',
        version: '3.1.4',
        description: 'Test application',
        author: 'Test Author',
        license: 'MIT',
        dependencies: {
          express: '^4.18.0',
        },
      });
      mockReadFile.mockResolvedValue(mockPackageJson);

      const config = await MicroserviceConfig.create('package.json');

      expect(config.microserviceVersion).toBe('3.1.4');
    });
  });
});
