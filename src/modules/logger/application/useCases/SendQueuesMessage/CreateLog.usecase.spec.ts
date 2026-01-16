import { Test, TestingModule } from '@nestjs/testing';

import { CreateLogUseCase } from './CreateLog.usecase';
import { CreateLogDTO } from './CreateLog.dto';
import { ElasticService } from '@shared/adapters/repository/elastic/elastic.service';

describe('CreateLogUseCase', () => {
  let useCase: CreateLogUseCase;
  let elasticService: ElasticService;

  const mockElasticService = {
    create: jest.fn(),
  };

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLogUseCase,
        {
          provide: ElasticService,
          useValue: mockElasticService,
        },
      ],
    }).compile();

    useCase = module.get<CreateLogUseCase>(CreateLogUseCase);
    elasticService = module.get<ElasticService>(ElasticService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should successfully create log in Elasticsearch', async () => {
      const dto: CreateLogDTO = {
        id: 'test-log-123',
        item: ['item1', 'item2'],
      };

      mockElasticService.create.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(consoleLogSpy).toHaveBeenCalledWith('CreateLogUseCase - DTO: ', dto);
      expect(consoleLogSpy).toHaveBeenCalledWith('CreateLogUseCase - LOG: ', {
        id: 'test-log-123',
        item: dto,
      });

      expect(elasticService.create).toHaveBeenCalledWith({
        id: 'test-log-123',
        item: dto,
      });

      expect(result).toEqual({
        status: 'success',
        message: 'created order',
        data: {},
      });
    });

    it('should handle Elasticsearch errors and return error response', async () => {
      const dto: CreateLogDTO = {
        id: 'test-log-error',
        item: ['item1'],
      };

      const elasticError = new Error('Elasticsearch connection failed');
      mockElasticService.create.mockRejectedValue(elasticError);

      const result = await useCase.execute(dto);

      expect(consoleLogSpy).toHaveBeenCalledWith('CreateLogUseCase - DTO: ', dto);
      expect(consoleErrorSpy).toHaveBeenCalledWith('CreateLogUseCase - ERROR: ', elasticError);

      expect(elasticService.create).toHaveBeenCalled();

      expect(result).toEqual({
        status: 'error',
        message: 'error creating order',
        data: {},
      });
    });

    it('should handle empty items array', async () => {
      const dto: CreateLogDTO = {
        id: 'test-log-empty',
        item: [],
      };

      mockElasticService.create.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(elasticService.create).toHaveBeenCalledWith({
        id: 'test-log-empty',
        item: dto,
      });

      expect(result).toEqual({
        status: 'success',
        message: 'created order',
        data: {},
      });
    });

    it('should log DTO and transformed log object', async () => {
      const dto: CreateLogDTO = {
        id: 'test-log-logging',
        item: ['log1', 'log2', 'log3'],
      };

      mockElasticService.create.mockResolvedValue(undefined);

      await useCase.execute(dto);

      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'CreateLogUseCase - DTO: ', dto);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'CreateLogUseCase - LOG: ', {
        id: 'test-log-logging',
        item: dto,
      });
    });

    it('should handle network timeout errors', async () => {
      const dto: CreateLogDTO = {
        id: 'test-log-timeout',
        item: ['item1'],
      };

      const timeoutError = new Error('Request timeout');
      mockElasticService.create.mockRejectedValue(timeoutError);

      const result = await useCase.execute(dto);

      expect(result.status).toBe('error');
      expect(result.message).toBe('error creating order');
      expect(consoleErrorSpy).toHaveBeenCalledWith('CreateLogUseCase - ERROR: ', timeoutError);
    });

    it('should handle undefined error objects', async () => {
      const dto: CreateLogDTO = {
        id: 'test-log-undefined-error',
        item: ['item1'],
      };

      mockElasticService.create.mockRejectedValue(undefined);

      const result = await useCase.execute(dto);

      expect(result.status).toBe('error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('CreateLogUseCase - ERROR: ', undefined);
    });
  });
});
