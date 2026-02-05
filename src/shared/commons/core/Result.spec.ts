import { Result, Left, Right, left, right, Either } from './Result';

describe('Result', () => {
  describe('constructor', () => {
    it('should create a successful result with value', () => {
      const result = new Result<string>(true, undefined, 'success-value');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBe('success-value');
    });

    it('should create a failed result with error', () => {
      const result = new Result<string>(false, 'error-message');

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.errorValue()).toBe('error-message');
    });

    it('should throw error when success and error both provided', () => {
      expect(() => {
        new Result<string>(true, 'error', 'value');
      }).toThrow('InvalidOperation: A result cannot be successful and contain an error');
    });

    it('should throw error when failure without error message', () => {
      expect(() => {
        new Result<string>(false);
      }).toThrow('InvalidOperation: A failing result needs to contain an error message');
    });

    it('should freeze the result object', () => {
      const result = new Result<string>(true, undefined, 'frozen');

      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe('ok', () => {
    it('should create a successful result', () => {
      const result = Result.ok<string>('test-value');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBe('test-value');
    });

    it('should create a successful result with undefined value', () => {
      const result = Result.ok<void>();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeUndefined();
    });

    it('should create a successful result with number', () => {
      const result = Result.ok<number>(42);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBe(42);
    });

    it('should create a successful result with object', () => {
      const value = { name: 'test', id: 1 };
      const result = Result.ok(value);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(value);
    });

    it('should create a successful result with array', () => {
      const result = Result.ok<string[]>(['a', 'b', 'c']);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('fail', () => {
    it('should create a failed result', () => {
      const result = Result.fail<string>('error occurred');

      expect(result.isFailure).toBe(true);
      expect(result.errorValue()).toBe('error occurred');
    });

    it('should create a failed result with detailed error', () => {
      const result = Result.fail<number>('Value must be positive');

      expect(result.isFailure).toBe(true);
      expect(result.errorValue()).toBe('Value must be positive');
    });
  });

  describe('getValue', () => {
    it('should return value for successful result', () => {
      const result = Result.ok<string>('my-value');

      expect(result.getValue()).toBe('my-value');
    });

    it('should throw error for failed result', () => {
      const result = Result.fail<string>('error');

      expect(() => result.getValue()).toThrow(
        'Can\'t get the value of an error result. Use "errorValue" instead.'
      );
    });
  });

  describe('errorValue', () => {
    it('should return error for failed result', () => {
      const result = Result.fail<string>('my-error');

      expect(result.errorValue()).toBe('my-error');
    });

    it('should return undefined for successful result', () => {
      const result = Result.ok<string>('value');

      expect(result.error).toBeUndefined();
    });
  });

  describe('isSuccess and isFailure', () => {
    it('should correctly identify successful result', () => {
      const result = Result.ok<string>('test');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
    });

    it('should correctly identify failed result', () => {
      const result = Result.fail<string>('error');

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
    });
  });
});

describe('Either', () => {
  describe('Left', () => {
    it('should create a Left with value', () => {
      const leftValue = new Left<string, number>('error');

      expect(leftValue.value).toBe('error');
      expect(leftValue.isLeft()).toBe(true);
      expect(leftValue.isRight()).toBe(false);
    });

    it('should work with complex error types', () => {
      interface ErrorType {
        code: number;
        message: string;
      }
      const error: ErrorType = { code: 404, message: 'Not found' };
      const leftValue = new Left<ErrorType, string>(error);

      expect(leftValue.value).toEqual(error);
      expect(leftValue.isLeft()).toBe(true);
    });
  });

  describe('Right', () => {
    it('should create a Right with value', () => {
      const rightValue = new Right<string, number>(42);

      expect(rightValue.value).toBe(42);
      expect(rightValue.isRight()).toBe(true);
      expect(rightValue.isLeft()).toBe(false);
    });

    it('should work with complex success types', () => {
      interface SuccessType {
        data: string[];
        count: number;
      }
      const success: SuccessType = { data: ['a', 'b'], count: 2 };
      const rightValue = new Right<string, SuccessType>(success);

      expect(rightValue.value).toEqual(success);
      expect(rightValue.isRight()).toBe(true);
    });
  });

  describe('left helper function', () => {
    it('should create a Left Either', () => {
      const result: Either<string, number> = left('error');

      expect(result.isLeft()).toBe(true);
      expect(result.isRight()).toBe(false);
      expect(result.value).toBe('error');
    });
  });

  describe('right helper function', () => {
    it('should create a Right Either', () => {
      const result: Either<string, number> = right(42);

      expect(result.isRight()).toBe(true);
      expect(result.isLeft()).toBe(false);
      expect(result.value).toBe(42);
    });
  });

  describe('type guards', () => {
    it('should narrow type with isLeft', () => {
      const result: Either<string, number> = left('error');

      if (result.isLeft()) {
        expect(result.value).toBe('error');
      }
    });

    it('should narrow type with isRight', () => {
      const result: Either<string, number> = right(100);

      if (result.isRight()) {
        expect(result.value).toBe(100);
      }
    });
  });
});
