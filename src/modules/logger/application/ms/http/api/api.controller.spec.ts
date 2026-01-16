import { Test, TestingModule } from '@nestjs/testing';

import { ApiController } from './api.controller';
import { ClientsService } from './api.service';
import { CreateLogDTO } from './api.dto';

describe('Logger ApiController', () => {
  let controller: ApiController;
  let service: ClientsService;

  const mockClientService = {
    createLog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientService,
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveLogs', () => {
    it('should call createLog with transformed DTO', async () => {
      const requestBody: CreateLogDTO = {
        trackingId: 'test-tracking-123',
        items: ['item1', 'item2', 'item3'],
      };

      const expectedResponse = {
        status: 'success',
        message: 'created order',
        data: {},
      };

      mockClientService.createLog.mockResolvedValue(expectedResponse);

      const result = await controller.saveLogs(requestBody);

      expect(service.createLog).toHaveBeenCalledWith({
        id: 'test-tracking-123',
        item: ['item1', 'item2', 'item3'],
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should handle empty items array', async () => {
      const requestBody: CreateLogDTO = {
        trackingId: 'test-tracking-456',
        items: [],
      };

      const expectedResponse = {
        status: 'success',
        message: 'created order',
        data: {},
      };

      mockClientService.createLog.mockResolvedValue(expectedResponse);

      const result = await controller.saveLogs(requestBody);

      expect(service.createLog).toHaveBeenCalledWith({
        id: 'test-tracking-456',
        item: [],
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate service errors', async () => {
      const requestBody: CreateLogDTO = {
        trackingId: 'test-tracking-error',
        items: ['item1'],
      };

      const errorResponse = {
        status: 'error',
        message: 'error creating order',
        data: {},
      };

      mockClientService.createLog.mockResolvedValue(errorResponse);

      const result = await controller.saveLogs(requestBody);

      expect(result).toEqual(errorResponse);
    });
  });
});
