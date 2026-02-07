import type { EventProps } from './Event.base';
import { Event } from './Event.base';

class TestEvent extends Event {
  readonly data: string;

  constructor(props: EventProps<{ data: string }>) {
    super(props);
    this.data = (props as any).data;
  }
}

describe('event', () => {
  describe('constructor', () => {
    it('should create an Event with auto-generated ID', () => {
      const props: EventProps<{ data: string }> = {
        data: 'test-data',
      };

      const event = new TestEvent(props);

      expect(event.id).toBeDefined();
      expect(typeof event.id).toBe('string');
      expect(event.id.length).toBe(24); // nanoid(24)
    });

    it('should generate different IDs for different events', () => {
      const props: EventProps<{ data: string }> = {
        data: 'test',
      };

      const event1 = new TestEvent(props);
      const event2 = new TestEvent(props);

      expect(event1.id).not.toBe(event2.id);
    });

    it('should create metadata with timestamp', () => {
      const beforeCreation = Date.now();

      const props: EventProps<{ data: string }> = {
        data: 'timestamp-test',
      };

      const event = new TestEvent(props);
      const afterCreation = Date.now();

      expect(event.metadata).toBeDefined();
      expect(event.metadata.timestamp).toBeGreaterThanOrEqual(beforeCreation);
      expect(event.metadata.timestamp).toBeLessThanOrEqual(afterCreation);
    });

    it('should use provided timestamp from metadata', () => {
      const customTimestamp = 1609459200000;
      const props: EventProps<{ data: string }> = {
        data: 'custom-timestamp',
        metadata: {
          timestamp: customTimestamp,
          correlationId: 'test',
        },
      };

      const event = new TestEvent(props);

      expect(event.metadata.timestamp).toBe(customTimestamp);
    });

    it('should set correlation ID from requestId in metadata', () => {
      const props: EventProps<{ data: string }> = {
        data: 'correlation-test',
        metadata: {
          requestId: 'request-123',
          timestamp: Date.now(),
          correlationId: 'correlation-456',
        },
      };

      const event = new TestEvent(props);

      expect(event.metadata.correlationId).toBe('request-123');
    });

    it('should set causation ID from metadata', () => {
      const props: EventProps<{ data: string }> = {
        data: 'causation-test',
        metadata: {
          causationId: 'caused-by-789',
          timestamp: Date.now(),
          correlationId: 'test',
        },
      };

      const event = new TestEvent(props);

      expect(event.metadata.causationId).toBe('caused-by-789');
    });

    it('should set user ID from metadata', () => {
      const props: EventProps<{ data: string }> = {
        data: 'user-test',
        metadata: {
          userId: 'user-456',
          timestamp: Date.now(),
          correlationId: 'test',
        },
      };

      const event = new TestEvent(props);

      expect(event.metadata.userId).toBe('user-456');
    });

    it('should throw error when props is empty', () => {
      expect(() => {
        new TestEvent({} as any);
      }).toThrow('DomainEvent props should not be empty');
    });

    it('should throw error when props is null', () => {
      expect(() => {
        new TestEvent(null as any);
      }).toThrow();
    });

    it('should throw error when props is undefined', () => {
      expect(() => {
        new TestEvent(undefined as any);
      }).toThrow();
    });
  });

  describe('custom data', () => {
    it('should allow custom data property', () => {
      const props: EventProps<{ data: string }> = {
        data: 'custom-data-value',
      };

      const event = new TestEvent(props);

      expect(event.data).toBe('custom-data-value');
    });
  });

  describe('metadata', () => {
    it('should have default metadata without optional fields', () => {
      const props: EventProps<{ data: string }> = {
        data: 'default-metadata',
      };

      const event = new TestEvent(props);

      expect(event.metadata.timestamp).toBeDefined();
      expect(event.metadata.correlationId).toBeUndefined();
      expect(event.metadata.causationId).toBeUndefined();
      expect(event.metadata.userId).toBeUndefined();
    });

    it('should preserve all metadata fields', () => {
      const props: EventProps<{ data: string }> = {
        data: 'full-metadata',
        metadata: {
          timestamp: 1234567890,
          correlationId: 'corr-1',
          causationId: 'cause-1',
          userId: 'user-1',
          requestId: 'req-1',
        },
      };

      const event = new TestEvent(props);

      expect(event.metadata.timestamp).toBe(1234567890);
      expect(event.metadata.correlationId).toBe('req-1');
      expect(event.metadata.causationId).toBe('cause-1');
      expect(event.metadata.userId).toBe('user-1');
    });
  });

  describe('iD generation', () => {
    it('should generate nanoid-style IDs', () => {
      const props: EventProps<{ data: string }> = {
        data: 'id-test',
      };

      const event = new TestEvent(props);

      // nanoid generates URL-friendly IDs
      expect(event.id).toMatch(/^[\w-]+$/);
    });

    it('should generate unique IDs across multiple creations', () => {
      const ids = new Set<string>();
      const count = 50;

      for (let i = 0; i < count; i++) {
        const event = new TestEvent({ data: `event-${i}` });
        ids.add(event.id);
      }

      expect(ids.size).toBe(count);
    });
  });
});
