import { Test, TestingModule } from '@nestjs/testing';

import CoreService from './core.service';

describe('CoreService (Order)', () => {
  let service: CoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreService],
    }).compile();

    service = module.get<CoreService>(CoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return success status', () => {
      const result = service.healthCheck();

      expect(result.status).toBe('success');
    });

    it('should return health check message', () => {
      const result = service.healthCheck();

      expect(result.message).toBe('NestJS is working!!!');
    });

    it('should return Responses<null> type', () => {
      const result = service.healthCheck();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
    });

    it('should return consistent response', () => {
      const result1 = service.healthCheck();
      const result2 = service.healthCheck();

      expect(result1).toEqual(result2);
    });
  });
});
