import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueEntityID';
import { RequestContextService } from '@shared/application/context/AppRequestContext';

interface TestEntityProps {
  name: string;
  value: number;
}

class TestEntity extends Entity<TestEntityProps> {
  constructor(props: TestEntityProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get value(): number {
    return this.props.value;
  }
}

describe('Entity', () => {
  beforeEach(() => {
    jest.spyOn(RequestContextService, 'getRequestId').mockReturnValue('test-request-id');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an Entity with props and auto-generated ID', () => {
      const props: TestEntityProps = {
        name: 'test-entity',
        value: 100,
      };

      const entity = new TestEntity(props);

      expect(entity.props).toBeDefined();
      expect(entity.props.name).toBe('test-entity');
      expect(entity.props.value).toBe(100);
      expect(entity.id).toBeDefined();
      expect(entity.id.id).toBeDefined();
    });

    it('should create an Entity with provided ID', () => {
      const props: TestEntityProps = {
        name: 'test-entity',
        value: 50,
      };
      const providedId = new UniqueEntityID('custom-entity-id');

      const entity = new TestEntity(props, providedId);

      expect(entity.id).toBe(providedId);
      expect(entity.id.id).toBe('custom-entity-id');
    });

    it('should generate different IDs for different entities', () => {
      const props: TestEntityProps = {
        name: 'test',
        value: 1,
      };

      const entity1 = new TestEntity(props);
      const entity2 = new TestEntity(props);

      expect(entity1.id.id).not.toBe(entity2.id.id);
    });
  });

  describe('props', () => {
    it('should have public readonly props', () => {
      const props: TestEntityProps = {
        name: 'readonly-test',
        value: 42,
      };

      const entity = new TestEntity(props);

      expect(entity.props).toBe(props);
    });

    it('should access props through getters', () => {
      const props: TestEntityProps = {
        name: 'getter-test',
        value: 99,
      };

      const entity = new TestEntity(props);

      expect(entity.name).toBe('getter-test');
      expect(entity.value).toBe(99);
    });
  });

  describe('id getter', () => {
    it('should return the entity ID', () => {
      const props: TestEntityProps = {
        name: 'id-test',
        value: 1,
      };
      const customId = new UniqueEntityID('test-id-123');

      const entity = new TestEntity(props, customId);

      expect(entity.id).toBe(customId);
      expect(entity.id.id).toBe('test-id-123');
    });

    it('should return auto-generated ID when not provided', () => {
      const props: TestEntityProps = {
        name: 'auto-id',
        value: 2,
      };

      const entity = new TestEntity(props);

      expect(entity.id).toBeDefined();
      expect(entity.id instanceof UniqueEntityID).toBe(true);
    });
  });

  describe('EventHandler inheritance', () => {
    it('should have events property from EventHandler', () => {
      const props: TestEntityProps = {
        name: 'event-test',
        value: 1,
      };

      const entity = new TestEntity(props);

      expect(entity.events).toBeDefined();
      expect(Array.isArray(entity.events)).toBe(true);
    });

    it('should start with empty events array', () => {
      const props: TestEntityProps = {
        name: 'empty-events',
        value: 1,
      };

      const entity = new TestEntity(props);

      expect(entity.events).toHaveLength(0);
    });
  });
});
