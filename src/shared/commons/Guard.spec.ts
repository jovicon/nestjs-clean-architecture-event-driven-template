import { Guard, IGuardResult } from './Guard';

describe('Guard', () => {
  describe('againstNullOrUndefined', () => {
    it('should succeed for valid string', () => {
      const result = Guard.againstNullOrUndefined('valid', 'testArg');

      expect(result.succeeded).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should succeed for empty string', () => {
      const result = Guard.againstNullOrUndefined('', 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for number', () => {
      const result = Guard.againstNullOrUndefined(42, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for zero', () => {
      const result = Guard.againstNullOrUndefined(0, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for false', () => {
      const result = Guard.againstNullOrUndefined(false, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for empty object', () => {
      const result = Guard.againstNullOrUndefined({}, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for empty array', () => {
      const result = Guard.againstNullOrUndefined([], 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should fail for null', () => {
      const result = Guard.againstNullOrUndefined(null, 'testArg');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg is null or undefined');
    });

    it('should fail for undefined', () => {
      const result = Guard.againstNullOrUndefined(undefined, 'testArg');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg is null or undefined');
    });
  });

  describe('againstNullOrUndefinedBulk', () => {
    it('should succeed when all arguments are valid', () => {
      const result = Guard.againstNullOrUndefinedBulk([
        { argument: 'value1', argumentName: 'arg1' },
        { argument: 42, argumentName: 'arg2' },
        { argument: true, argumentName: 'arg3' },
      ]);

      expect(result.succeeded).toBe(true);
    });

    it('should fail when first argument is null', () => {
      const result = Guard.againstNullOrUndefinedBulk([
        { argument: null, argumentName: 'arg1' },
        { argument: 'valid', argumentName: 'arg2' },
      ]);

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('arg1 is null or undefined');
    });

    it('should fail when middle argument is undefined', () => {
      const result = Guard.againstNullOrUndefinedBulk([
        { argument: 'valid', argumentName: 'arg1' },
        { argument: undefined, argumentName: 'arg2' },
        { argument: 'valid', argumentName: 'arg3' },
      ]);

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('arg2 is null or undefined');
    });

    it('should succeed with empty array', () => {
      const result = Guard.againstNullOrUndefinedBulk([]);

      expect(result.succeeded).toBe(true);
    });
  });

  describe('isNumber', () => {
    it('should succeed for number', () => {
      const result = Guard.isNumber(42, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for zero', () => {
      const result = Guard.isNumber(0, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for negative number', () => {
      const result = Guard.isNumber(-10, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for decimal', () => {
      const result = Guard.isNumber(3.14, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should fail for string', () => {
      const result = Guard.isNumber('42', 'testArg');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg is not a number');
    });

    it('should fail for null', () => {
      const result = Guard.isNumber(null, 'testArg');

      expect(result.succeeded).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('should succeed for positive number', () => {
      const result = Guard.isPositiveNumber(10, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should fail for zero', () => {
      const result = Guard.isPositiveNumber(0, 'testArg');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg is not greater than 0');
    });

    it('should fail for negative number', () => {
      const result = Guard.isPositiveNumber(-5, 'testArg');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg is not greater than 0');
    });
  });

  describe('valueBetween', () => {
    it('should succeed when value is within range', () => {
      const result = Guard.valueBetween(5, 'testArg', 1, 10);

      expect(result.succeeded).toBe(true);
    });

    it('should succeed when value equals min', () => {
      const result = Guard.valueBetween(1, 'testArg', 1, 10);

      expect(result.succeeded).toBe(true);
    });

    it('should succeed when value equals max', () => {
      const result = Guard.valueBetween(10, 'testArg', 1, 10);

      expect(result.succeeded).toBe(true);
    });

    it('should fail when value is below min', () => {
      const result = Guard.valueBetween(0, 'testArg', 1, 10);

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg must be between 1 and 10');
    });

    it('should fail when value is above max', () => {
      const result = Guard.valueBetween(11, 'testArg', 1, 10);

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg must be between 1 and 10');
    });
  });

  describe('isNaN', () => {
    it('should succeed for valid number', () => {
      const result = Guard.isNaN(42, 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should fail for NaN', () => {
      const result = Guard.isNaN(NaN, 'testArg');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg is not a number');
    });
  });

  describe('isOneOf', () => {
    it('should succeed when value is in valid values', () => {
      const result = Guard.isOneOf('active', ['active', 'inactive', 'pending'], 'status');

      expect(result.succeeded).toBe(true);
    });

    it('should fail when value is not in valid values', () => {
      const result = Guard.isOneOf('unknown', ['active', 'inactive'], 'status');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("status 'unknown' isn't a correct value.");
    });

    it('should work with numbers', () => {
      const result = Guard.isOneOf(2, [1, 2, 3], 'priority');

      expect(result.succeeded).toBe(true);
    });
  });

  describe('isArray', () => {
    it('should succeed for array', () => {
      const result = Guard.isArray([1, 2, 3], 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for empty array', () => {
      const result = Guard.isArray([], 'testArg');

      expect(result.succeeded).toBe(true);
    });

    it('should fail for string', () => {
      const result = Guard.isArray('not-array', 'testArg');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('testArg is not an array');
    });

    it('should fail for object', () => {
      const result = Guard.isArray({ length: 3 }, 'testArg');

      expect(result.succeeded).toBe(false);
    });
  });

  describe('checkArrayValues', () => {
    it('should succeed when all values are valid', () => {
      const result = Guard.checkArrayValues(['a', 'b'], 'items', ['a', 'b', 'c']);

      expect(result.succeeded).toBe(true);
    });

    it('should fail when one value is invalid', () => {
      const result = Guard.checkArrayValues(['a', 'd'], 'items', ['a', 'b', 'c']);

      expect(result.succeeded).toBe(false);
      expect(result.message).toContain("'d' isn't a correct value");
    });

    it('should fail when not an array', () => {
      const result = Guard.checkArrayValues('not-array' as any, 'items', ['a', 'b']);

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('items is not an array');
    });

    it('should succeed for empty array', () => {
      const result = Guard.checkArrayValues([], 'items', ['a', 'b']);

      expect(result.succeeded).toBe(true);
    });
  });

  describe('againstAtLeast', () => {
    it('should succeed when text has enough characters', () => {
      const result = Guard.againstAtLeast(5, 'hello world', 'text');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed when text has exact minimum characters', () => {
      const result = Guard.againstAtLeast(5, 'hello', 'text');

      expect(result.succeeded).toBe(true);
    });

    it('should fail when text is too short', () => {
      const result = Guard.againstAtLeast(10, 'hello', 'text');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('text is not at least 10 chars.');
    });
  });

  describe('againstAtMost', () => {
    it('should succeed when text is within limit', () => {
      const result = Guard.againstAtMost(10, 'hello', 'text');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed when text has exact maximum characters', () => {
      const result = Guard.againstAtMost(5, 'hello', 'text');

      expect(result.succeeded).toBe(true);
    });

    it('should fail when text exceeds limit', () => {
      const result = Guard.againstAtMost(3, 'hello', 'text');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('text is greater than 3 chars.');
    });
  });

  describe('isValidRut', () => {
    it('should succeed for valid RUT', () => {
      const result = Guard.isValidRut('12345678-5');

      expect(result.succeeded).toBe(true);
    });

    it('should succeed for valid RUT with K', () => {
      const result = Guard.isValidRut('11111111-1');

      expect(result.succeeded).toBe(true);
    });

    it('should fail for RUT without dash', () => {
      const result = Guard.isValidRut('123456785');

      expect(result.succeeded).toBe(false);
    });

    it('should fail for invalid RUT check digit', () => {
      const result = Guard.isValidRut('12345678-0');

      expect(result.succeeded).toBe(false);
      expect(result.message).toBe('Rut invalido');
    });
  });

  describe('isEmpty', () => {
    it('should return true for undefined', () => {
      expect(Guard.isEmpty(undefined)).toBe(true);
    });

    it('should return true for null', () => {
      expect(Guard.isEmpty(null)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(Guard.isEmpty('')).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(Guard.isEmpty({})).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(Guard.isEmpty([])).toBe(true);
    });

    it('should return true for array with only empty items', () => {
      expect(Guard.isEmpty([null, undefined, ''])).toBe(true);
    });

    it('should return false for number', () => {
      expect(Guard.isEmpty(42)).toBe(false);
    });

    it('should return false for zero', () => {
      expect(Guard.isEmpty(0)).toBe(false);
    });

    it('should return false for boolean true', () => {
      expect(Guard.isEmpty(true)).toBe(false);
    });

    it('should return false for boolean false', () => {
      expect(Guard.isEmpty(false)).toBe(false);
    });

    it('should return false for non-empty string', () => {
      expect(Guard.isEmpty('hello')).toBe(false);
    });

    it('should return false for non-empty object', () => {
      expect(Guard.isEmpty({ key: 'value' })).toBe(false);
    });

    it('should return false for non-empty array', () => {
      expect(Guard.isEmpty([1, 2, 3])).toBe(false);
    });

    it('should return false for Date', () => {
      expect(Guard.isEmpty(new Date())).toBe(false);
    });
  });
});
