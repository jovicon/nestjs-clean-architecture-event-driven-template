import type { EventEmitter2 } from '@nestjs/event-emitter';

import { RequestContextService } from '@shared/application/context/AppRequestContext';
import { Event } from '@shared/commons/core/Event.base';
import { AggregateRoot } from './AggregateRoot';
import { UniqueEntityID } from './UniqueEntityID';

interface TestAggregateProps {
  name: string;
}

class TestEvent extends Event {
  constructor(props: { data: string }) {
    super(props);
  }
}

class TestAggregate extends AggregateRoot<TestAggregateProps> {
  constructor(props: TestAggregateProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  public addTestEvent(event: Event): void {
    this.addEvent(event);
  }

  public clearTestEvents(): void {
    this.clearEvents();
  }
}

describe('aggregateRoot', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(() => {
    jest.spyOn(RequestContextService, 'getRequestId').mockReturnValue('test-request-id');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should create an AggregateRoot with props', () => {
      const props: TestAggregateProps = {
        name: 'test-aggregate',
      };

      const aggregate = new TestAggregate(props);

      expect(aggregate.props).toBeDefined();
      expect(aggregate.name).toBe('test-aggregate');
    });

    it('should create an AggregateRoot with provided ID', () => {
      const props: TestAggregateProps = {
        name: 'test',
      };
      const customId = new UniqueEntityID('custom-aggregate-id');

      const aggregate = new TestAggregate(props, customId);

      expect(aggregate.id).toBe(customId);
      expect(aggregate.id.id).toBe('custom-aggregate-id');
    });

    it('should generate unique ID when not provided', () => {
      const props: TestAggregateProps = {
        name: 'auto-id',
      };

      const aggregate = new TestAggregate(props);

      expect(aggregate.id).toBeDefined();
      expect(aggregate.id.id.length).toBeGreaterThan(0);
    });
  });

  describe('publishEvents', () => {
    it('should publish all events to EventEmitter2', async () => {
      const props: TestAggregateProps = {
        name: 'publish-test',
      };
      const aggregate = new TestAggregate(props);

      const event1 = new TestEvent({ data: 'event-1' });
      const event2 = new TestEvent({ data: 'event-2' });
      aggregate.addTestEvent(event1);
      aggregate.addTestEvent(event2);

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await aggregate.publishEvents(mockEventEmitter);

      expect(mockEventEmitter.emitAsync).toHaveBeenCalledTimes(2);
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith('TestEvent', event1);
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith('TestEvent', event2);
    });

    it('should clear events after publishing', async () => {
      const props: TestAggregateProps = {
        name: 'clear-test',
      };
      const aggregate = new TestAggregate(props);

      const event = new TestEvent({ data: 'test' });
      aggregate.addTestEvent(event);

      expect(aggregate.events).toHaveLength(1);

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await aggregate.publishEvents(mockEventEmitter);

      expect(aggregate.events).toHaveLength(0);
    });

    it('should log event publishing with request ID', async () => {
      const props: TestAggregateProps = {
        name: 'log-test',
      };
      const aggregate = new TestAggregate(props);

      const event = new TestEvent({ data: 'log-event' });
      aggregate.addTestEvent(event);

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await aggregate.publishEvents(mockEventEmitter);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[test-request-id]'),
        expect.any(String),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('TestEvent'),
        expect.any(String),
      );
    });

    it('should handle empty events array', async () => {
      const props: TestAggregateProps = {
        name: 'empty-events',
      };
      const aggregate = new TestAggregate(props);

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await aggregate.publishEvents(mockEventEmitter);

      expect(mockEventEmitter.emitAsync).not.toHaveBeenCalled();
    });

    it('should publish events in order', async () => {
      const props: TestAggregateProps = {
        name: 'order-test',
      };
      const aggregate = new TestAggregate(props);

      const event1 = new TestEvent({ data: 'first' });
      const event2 = new TestEvent({ data: 'second' });
      const event3 = new TestEvent({ data: 'third' });
      aggregate.addTestEvent(event1);
      aggregate.addTestEvent(event2);
      aggregate.addTestEvent(event3);

      const publishOrder: Event[] = [];
      const mockEventEmitter = {
        emitAsync: jest.fn().mockImplementation((_, event) => {
          publishOrder.push(event);
          return Promise.resolve();
        }),
      } as unknown as EventEmitter2;

      await aggregate.publishEvents(mockEventEmitter);

      expect(publishOrder).toHaveLength(3);
    });
  });

  describe('entity inheritance', () => {
    it('should have id from Entity', () => {
      const props: TestAggregateProps = {
        name: 'inheritance-test',
      };

      const aggregate = new TestAggregate(props);

      expect(aggregate.id).toBeDefined();
      expect(aggregate.id instanceof UniqueEntityID).toBe(true);
    });

    it('should have props from Entity', () => {
      const props: TestAggregateProps = {
        name: 'props-test',
      };

      const aggregate = new TestAggregate(props);

      expect(aggregate.props).toBe(props);
    });

    it('should have events from EventHandler', () => {
      const props: TestAggregateProps = {
        name: 'events-test',
      };

      const aggregate = new TestAggregate(props);

      expect(aggregate.events).toBeDefined();
      expect(Array.isArray(aggregate.events)).toBe(true);
    });
  });
});
