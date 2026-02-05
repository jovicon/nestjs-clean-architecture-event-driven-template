import { ValueObject } from './ValueObject';

interface TestValueObjectProps {
  name: string;
  count: number;
}

class TestValueObject extends ValueObject<TestValueObjectProps> {
  constructor(props: TestValueObjectProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  get count(): number {
    return this.props.count;
  }
}

describe('ValueObject', () => {
  describe('constructor', () => {
    it('should create a ValueObject with given props', () => {
      const props: TestValueObjectProps = {
        name: 'test',
        count: 5,
      };

      const valueObject = new TestValueObject(props);

      expect(valueObject.props).toBeDefined();
      expect(valueObject.props.name).toBe('test');
      expect(valueObject.props.count).toBe(5);
    });

    it('should spread props to create a new object', () => {
      const props: TestValueObjectProps = {
        name: 'original',
        count: 10,
      };

      const valueObject = new TestValueObject(props);

      // Modifying original props should not affect ValueObject
      props.name = 'modified';

      expect(valueObject.props.name).toBe('original');
    });

    it('should handle empty string values', () => {
      const props: TestValueObjectProps = {
        name: '',
        count: 0,
      };

      const valueObject = new TestValueObject(props);

      expect(valueObject.props.name).toBe('');
      expect(valueObject.props.count).toBe(0);
    });

    it('should handle special characters in string values', () => {
      const props: TestValueObjectProps = {
        name: 'test-@#$%^&*()_+=',
        count: 100,
      };

      const valueObject = new TestValueObject(props);

      expect(valueObject.props.name).toBe('test-@#$%^&*()_+=');
    });

    it('should handle negative numbers', () => {
      const props: TestValueObjectProps = {
        name: 'negative-test',
        count: -50,
      };

      const valueObject = new TestValueObject(props);

      expect(valueObject.props.count).toBe(-50);
    });
  });

  describe('props access', () => {
    it('should allow access to props via getter', () => {
      const props: TestValueObjectProps = {
        name: 'getter-test',
        count: 42,
      };

      const valueObject = new TestValueObject(props);

      expect(valueObject.name).toBe('getter-test');
      expect(valueObject.count).toBe(42);
    });

    it('should have public props property', () => {
      const props: TestValueObjectProps = {
        name: 'public-props-test',
        count: 7,
      };

      const valueObject = new TestValueObject(props);

      expect(valueObject.props).toBeDefined();
      expect(typeof valueObject.props).toBe('object');
    });
  });

  describe('immutability', () => {
    it('should create ValueObject with copied props', () => {
      const props: TestValueObjectProps = {
        name: 'immutable',
        count: 1,
      };

      const valueObject = new TestValueObject(props);

      expect(valueObject.props).not.toBe(props);
      expect(valueObject.props.name).toBe(props.name);
      expect(valueObject.props.count).toBe(props.count);
    });
  });
});
