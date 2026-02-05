import { DomainEvent, DomainEventProps } from './DomainEvent.base';
import { UniqueEntityID } from './UniqueEntityID';

class TestDomainEvent extends DomainEvent {
  readonly data: string;

  constructor(props: DomainEventProps<TestDomainEvent>) {
    super(props);
    this.data = (props as any).data;
  }
}

describe('DomainEvent', () => {
  describe('constructor', () => {
    it('should create a DomainEvent with aggregateId', () => {
      const aggregateId = new UniqueEntityID('test-aggregate-id');
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'test-data',
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.aggregateId).toBe(aggregateId);
      expect(event.aggregateId.id).toBe('test-aggregate-id');
    });

    it('should generate unique event ID', () => {
      const aggregateId = new UniqueEntityID();
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'test',
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.id).toBeDefined();
      expect(typeof event.id).toBe('string');
      expect(event.id.length).toBeGreaterThan(0);
    });

    it('should generate different IDs for different events', () => {
      const aggregateId = new UniqueEntityID();
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'test',
      } as DomainEventProps<TestDomainEvent>;

      const event1 = new TestDomainEvent(props);
      const event2 = new TestDomainEvent(props);

      expect(event1.id).not.toBe(event2.id);
    });

    it('should create metadata with timestamp', () => {
      const aggregateId = new UniqueEntityID();
      const beforeCreation = Date.now();

      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'timestamp-test',
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);
      const afterCreation = Date.now();

      expect(event.metadata).toBeDefined();
      expect(event.metadata.timestamp).toBeGreaterThanOrEqual(beforeCreation);
      expect(event.metadata.timestamp).toBeLessThanOrEqual(afterCreation);
    });

    it('should use provided metadata timestamp', () => {
      const aggregateId = new UniqueEntityID();
      const customTimestamp = 1609459200000; // 2021-01-01T00:00:00.000Z

      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'custom-timestamp',
        metadata: {
          timestamp: customTimestamp,
          correlationId: 'test-correlation',
        },
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.metadata.timestamp).toBe(customTimestamp);
    });

    it('should throw error when props is empty', () => {
      expect(() => {
        new TestDomainEvent({} as any);
      }).toThrow('DomainEvent props should not be empty');
    });

    it('should throw error when props is null', () => {
      expect(() => {
        new TestDomainEvent(null as any);
      }).toThrow();
    });

    it('should throw error when props is undefined', () => {
      expect(() => {
        new TestDomainEvent(undefined as any);
      }).toThrow();
    });

    it('should set correlation ID from metadata', () => {
      const aggregateId = new UniqueEntityID();
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'correlation-test',
        metadata: {
          requestId: 'request-123',
          timestamp: Date.now(),
          correlationId: 'correlation-456',
        },
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.metadata.correlationId).toBe('request-123');
    });

    it('should set causation ID from metadata', () => {
      const aggregateId = new UniqueEntityID();
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'causation-test',
        metadata: {
          causationId: 'caused-by-event-789',
          timestamp: Date.now(),
          correlationId: 'test',
        },
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.metadata.causationId).toBe('caused-by-event-789');
    });

    it('should set user ID from metadata', () => {
      const aggregateId = new UniqueEntityID();
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'user-test',
        metadata: {
          userId: 'user-456',
          timestamp: Date.now(),
          correlationId: 'test',
        },
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.metadata.userId).toBe('user-456');
    });
  });

  describe('Event inheritance', () => {
    it('should inherit from Event base class', () => {
      const aggregateId = new UniqueEntityID();
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'inheritance-test',
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.id).toBeDefined();
      expect(event.metadata).toBeDefined();
    });
  });

  describe('custom data', () => {
    it('should allow custom data in event', () => {
      const aggregateId = new UniqueEntityID();
      const props: DomainEventProps<TestDomainEvent> = {
        aggregateId,
        data: 'custom-data-value',
      } as DomainEventProps<TestDomainEvent>;

      const event = new TestDomainEvent(props);

      expect(event.data).toBe('custom-data-value');
    });
  });
});
