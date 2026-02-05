import { EventEmitter2 } from '@nestjs/event-emitter';

import { EventHandler } from './Event.handler';
import { Event } from './Event.base';
import { RequestContextService } from '@shared/application/context/AppRequestContext';

class TestEvent extends Event {
  readonly data: string;

  constructor(data: string) {
    super({ data });
    this.data = data;
  }
}

class TestEventHandler extends EventHandler {
  public addTestEvent(event: Event): void {
    this.addEvent(event);
  }

  public clearTestEvents(): void {
    this.clearEvents();
  }

  public getRequestId(): string {
    return this.requestId;
  }
}

describe('EventHandler', () => {
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

  describe('events', () => {
    it('should start with empty events array', () => {
      const handler = new TestEventHandler();

      expect(handler.events).toBeDefined();
      expect(handler.events).toHaveLength(0);
    });

    it('should return events array', () => {
      const handler = new TestEventHandler();

      expect(Array.isArray(handler.events)).toBe(true);
    });
  });

  describe('addEvent', () => {
    it('should add event to events array', () => {
      const handler = new TestEventHandler();
      const event = new TestEvent('test-data');

      handler.addTestEvent(event);

      expect(handler.events).toHaveLength(1);
      expect(handler.events[0]).toBe(event);
    });

    it('should add multiple events', () => {
      const handler = new TestEventHandler();
      const event1 = new TestEvent('event-1');
      const event2 = new TestEvent('event-2');
      const event3 = new TestEvent('event-3');

      handler.addTestEvent(event1);
      handler.addTestEvent(event2);
      handler.addTestEvent(event3);

      expect(handler.events).toHaveLength(3);
    });

    it('should preserve event order', () => {
      const handler = new TestEventHandler();
      const event1 = new TestEvent('first');
      const event2 = new TestEvent('second');

      handler.addTestEvent(event1);
      handler.addTestEvent(event2);

      expect(handler.events[0]).toBe(event1);
      expect(handler.events[1]).toBe(event2);
    });
  });

  describe('clearEvents', () => {
    it('should clear all events', () => {
      const handler = new TestEventHandler();
      handler.addTestEvent(new TestEvent('event-1'));
      handler.addTestEvent(new TestEvent('event-2'));

      expect(handler.events).toHaveLength(2);

      handler.clearTestEvents();

      expect(handler.events).toHaveLength(0);
    });

    it('should handle clearing empty events array', () => {
      const handler = new TestEventHandler();

      handler.clearTestEvents();

      expect(handler.events).toHaveLength(0);
    });
  });

  describe('publishEvents', () => {
    it('should publish events to all handlers', async () => {
      const handler = new TestEventHandler();
      const event = new TestEvent('publish-test');
      handler.addTestEvent(event);

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      const handlers = ['handler1', 'handler2'];

      await handler.publishEvents(mockEventEmitter, handlers);

      expect(mockEventEmitter.emitAsync).toHaveBeenCalledTimes(2);
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith('handler1', event);
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith('handler2', event);
    });

    it('should clear events after publishing', async () => {
      const handler = new TestEventHandler();
      handler.addTestEvent(new TestEvent('clear-test'));

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await handler.publishEvents(mockEventEmitter, ['handler']);

      expect(handler.events).toHaveLength(0);
    });

    it('should log each handler when publishing', async () => {
      const handler = new TestEventHandler();
      handler.addTestEvent(new TestEvent('log-test'));

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await handler.publishEvents(mockEventEmitter, ['testHandler']);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[test-request-id]'),
        'testHandler'
      );
    });

    it('should handle empty events array', async () => {
      const handler = new TestEventHandler();

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await handler.publishEvents(mockEventEmitter, ['handler']);

      expect(mockEventEmitter.emitAsync).not.toHaveBeenCalled();
    });

    it('should handle empty handlers array', async () => {
      const handler = new TestEventHandler();
      handler.addTestEvent(new TestEvent('empty-handlers'));

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await handler.publishEvents(mockEventEmitter, []);

      expect(mockEventEmitter.emitAsync).not.toHaveBeenCalled();
    });

    it('should publish multiple events to multiple handlers', async () => {
      const handler = new TestEventHandler();
      handler.addTestEvent(new TestEvent('event-1'));
      handler.addTestEvent(new TestEvent('event-2'));

      const mockEventEmitter = {
        emitAsync: jest.fn().mockResolvedValue(undefined),
      } as unknown as EventEmitter2;

      await handler.publishEvents(mockEventEmitter, ['h1', 'h2']);

      // 2 events * 2 handlers = 4 calls
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledTimes(4);
    });
  });

  describe('requestId', () => {
    it('should have requestId from RequestContextService', () => {
      const handler = new TestEventHandler();

      expect(handler.getRequestId()).toBe('test-request-id');
    });
  });
});
