import type { UseCase } from './UseCase';

interface TestRequest {
  id: string;
  data: string;
}

interface TestResponse {
  success: boolean;
  result: string;
}

class TestUseCase implements UseCase<TestRequest, TestResponse> {
  execute(request: TestRequest): TestResponse {
    return {
      success: true,
      result: `Processed ${request.data} for ${request.id}`,
    };
  }
}

class AsyncTestUseCase implements UseCase<TestRequest, Promise<TestResponse>> {
  async execute(request: TestRequest): Promise<TestResponse> {
    return {
      success: true,
      result: `Async processed ${request.data} for ${request.id}`,
    };
  }
}

class NoRequestUseCase implements UseCase<void, TestResponse> {
  execute(): TestResponse {
    return {
      success: true,
      result: 'No request needed',
    };
  }
}

class OptionalRequestUseCase implements UseCase<TestRequest | undefined, TestResponse> {
  execute(request?: TestRequest): TestResponse {
    if (request) {
      return {
        success: true,
        result: `With request: ${request.data}`,
      };
    }
    return {
      success: true,
      result: 'Without request',
    };
  }
}

describe('useCase', () => {
  describe('synchronous execute', () => {
    it('should execute with request and return response', () => {
      const useCase = new TestUseCase();
      const request: TestRequest = {
        id: 'test-1',
        data: 'test-data',
      };

      const response = useCase.execute(request);

      expect(response.success).toBe(true);
      expect(response.result).toBe('Processed test-data for test-1');
    });

    it('should handle different request data', () => {
      const useCase = new TestUseCase();

      const response1 = useCase.execute({ id: 'a', data: 'first' });
      const response2 = useCase.execute({ id: 'b', data: 'second' });

      expect(response1.result).toContain('first');
      expect(response2.result).toContain('second');
    });
  });

  describe('asynchronous execute', () => {
    it('should execute asynchronously with request', async () => {
      const useCase = new AsyncTestUseCase();
      const request: TestRequest = {
        id: 'async-1',
        data: 'async-data',
      };

      const response = await useCase.execute(request);

      expect(response.success).toBe(true);
      expect(response.result).toBe('Async processed async-data for async-1');
    });

    it('should return a Promise', () => {
      const useCase = new AsyncTestUseCase();
      const request: TestRequest = {
        id: 'promise-test',
        data: 'data',
      };

      const result = useCase.execute(request);

      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('execute without request', () => {
    it('should execute without request parameter', () => {
      const useCase = new NoRequestUseCase();

      const response = useCase.execute();

      expect(response.success).toBe(true);
      expect(response.result).toBe('No request needed');
    });
  });

  describe('execute with optional request', () => {
    it('should execute with request when provided', () => {
      const useCase = new OptionalRequestUseCase();
      const request: TestRequest = {
        id: 'optional-1',
        data: 'optional-data',
      };

      const response = useCase.execute(request);

      expect(response.success).toBe(true);
      expect(response.result).toBe('With request: optional-data');
    });

    it('should execute without request when not provided', () => {
      const useCase = new OptionalRequestUseCase();

      const response = useCase.execute();

      expect(response.success).toBe(true);
      expect(response.result).toBe('Without request');
    });

    it('should execute with undefined request', () => {
      const useCase = new OptionalRequestUseCase();

      const response = useCase.execute(undefined);

      expect(response.success).toBe(true);
      expect(response.result).toBe('Without request');
    });
  });

  describe('interface compliance', () => {
    it('should implement UseCase interface correctly', () => {
      const useCase: UseCase<TestRequest, TestResponse> = new TestUseCase();

      expect(typeof useCase.execute).toBe('function');
    });

    it('should work with generic types', () => {
      interface CustomRequest {
        items: string[];
      }
      interface CustomResponse {
        count: number;
      }

      class CustomUseCase implements UseCase<CustomRequest, CustomResponse> {
        execute(request: CustomRequest): CustomResponse {
          return { count: request.items.length };
        }
      }

      const useCase = new CustomUseCase();
      const response = useCase.execute({ items: ['a', 'b', 'c'] });

      expect(response.count).toBe(3);
    });
  });
});
