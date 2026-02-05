import { Test, TestingModule } from '@nestjs/testing';

import CoreController from './core.controller';
import CoreService from './core.service';

describe('CoreController (Products)', () => {
  let controller: CoreController;
  let coreService: CoreService;

  const mockCoreService = {
    healthCheck: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        {
          provide: CoreService,
          useValue: mockCoreService,
        },
      ],
    }).compile();

    controller = module.get<CoreController>(CoreController);
    coreService = module.get<CoreService>(CoreService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return health check response', () => {
      const expectedResponse = {
        status: 'success',
        message: 'NestJS is working!!!',
      };

      mockCoreService.healthCheck.mockReturnValue(expectedResponse);

      const result = controller.healthCheck();

      expect(result).toEqual(expectedResponse);
    });

    it('should call coreService.healthCheck', () => {
      mockCoreService.healthCheck.mockReturnValue({
        status: 'success',
        message: 'NestJS is working!!!',
      });

      controller.healthCheck();

      expect(coreService.healthCheck).toHaveBeenCalled();
      expect(coreService.healthCheck).toHaveBeenCalledTimes(1);
    });

    it('should return the exact response from service', () => {
      const serviceResponse = {
        status: 'success',
        message: 'Custom message',
      };

      mockCoreService.healthCheck.mockReturnValue(serviceResponse);

      const result = controller.healthCheck();

      expect(result).toBe(serviceResponse);
    });
  });
});
