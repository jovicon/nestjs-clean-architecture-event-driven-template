import { Identifier } from './Identifier';

describe('Identifier', () => {
  describe('constructor', () => {
    it('should create an Identifier with string value', () => {
      const identifier = new Identifier<string>('test-id');

      expect(identifier).toBeDefined();
    });

    it('should create an Identifier with number value', () => {
      const identifier = new Identifier<number>(12345);

      expect(identifier).toBeDefined();
    });

    it('should create an Identifier with object value', () => {
      const value = { id: 'complex', type: 'test' };
      const identifier = new Identifier(value);

      expect(identifier).toBeDefined();
    });

    it('should accept empty string', () => {
      const identifier = new Identifier<string>('');

      expect(identifier).toBeDefined();
    });

    it('should accept zero', () => {
      const identifier = new Identifier<number>(0);

      expect(identifier).toBeDefined();
    });

    it('should accept null value', () => {
      const identifier = new Identifier<null>(null);

      expect(identifier).toBeDefined();
    });

    it('should accept undefined value', () => {
      const identifier = new Identifier<undefined>(undefined);

      expect(identifier).toBeDefined();
    });

    it('should accept negative numbers', () => {
      const identifier = new Identifier<number>(-100);

      expect(identifier).toBeDefined();
    });

    it('should accept special characters in string', () => {
      const identifier = new Identifier<string>('id-@#$%^&*()_+');

      expect(identifier).toBeDefined();
    });

    it('should accept UUID format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const identifier = new Identifier<string>(uuid);

      expect(identifier).toBeDefined();
    });

    it('should accept boolean values', () => {
      const identifierTrue = new Identifier<boolean>(true);
      const identifierFalse = new Identifier<boolean>(false);

      expect(identifierTrue).toBeDefined();
      expect(identifierFalse).toBeDefined();
    });

    it('should accept array values', () => {
      const identifier = new Identifier<string[]>(['a', 'b', 'c']);

      expect(identifier).toBeDefined();
    });
  });

  describe('type safety', () => {
    it('should work with generic types', () => {
      interface CustomId {
        namespace: string;
        id: number;
      }

      const value: CustomId = { namespace: 'users', id: 123 };
      const identifier = new Identifier<CustomId>(value);

      expect(identifier).toBeDefined();
    });
  });
});
