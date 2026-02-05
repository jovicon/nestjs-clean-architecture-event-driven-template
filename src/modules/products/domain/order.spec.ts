import { Order, OrderProps } from './order';
import { OrderItem } from './orderItem';
import { OrderCreated } from './events/emitters/orderCreated.emitter';

describe('Order (Products Module)', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  describe('create', () => {
    it('should create a valid Order with items', () => {
      const item1 = OrderItem.create({ value: 'item1' }).getValue();
      const item2 = OrderItem.create({ value: 'item2' }).getValue();

      const props: OrderProps = {
        items: [item1, item2],
      };

      const result = Order.create(props);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);

      const order = result.getValue();
      expect(order).toBeDefined();
      expect(order['props'].items).toHaveLength(2);
      expect(order['props'].items[0]).toBe(item1);
      expect(order['props'].items[1]).toBe(item2);
    });

    it('should create Order with single item', () => {
      const item = OrderItem.create({ value: 'single-item' }).getValue();

      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);

      expect(result.isSuccess).toBe(true);
      const order = result.getValue();
      expect(order['props'].items).toHaveLength(1);
    });

    it('should create Order with empty items array', () => {
      const props: OrderProps = {
        items: [],
      };

      const result = Order.create(props);

      expect(result.isSuccess).toBe(true);
      const order = result.getValue();
      expect(order['props'].items).toHaveLength(0);
    });

    it('should create Order with multiple items', () => {
      const items = [
        OrderItem.create({ value: 'item1' }).getValue(),
        OrderItem.create({ value: 'item2' }).getValue(),
        OrderItem.create({ value: 'item3' }).getValue(),
        OrderItem.create({ value: 'item4' }).getValue(),
      ];

      const props: OrderProps = {
        items,
      };

      const result = Order.create(props);

      expect(result.isSuccess).toBe(true);
      const order = result.getValue();
      expect(order['props'].items).toHaveLength(4);
    });

    it('should fail when items is null', () => {
      const props: OrderProps = {
        items: null as any,
      };

      const result = Order.create(props);

      expect(result.isFailure).toBe(true);
      expect(result.isSuccess).toBe(false);
      expect(() => result.getValue()).toThrow();
      expect(result.errorValue()).toContain('items');
    });

    it('should fail when items is undefined', () => {
      const props: OrderProps = {
        items: undefined as any,
      };

      const result = Order.create(props);

      expect(result.isFailure).toBe(true);
      expect(result.isSuccess).toBe(false);
      expect(() => result.getValue()).toThrow();
      expect(result.errorValue()).toContain('items');
    });

    it('should throw when props is null', () => {
      expect(() => Order.create(null as any)).toThrow();
    });

    it('should throw when props is undefined', () => {
      expect(() => Order.create(undefined as any)).toThrow();
    });

    it('should add OrderCreated domain event when order is created', () => {
      const item = OrderItem.create({ value: 'event-test-item' }).getValue();

      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);
      const order = result.getValue();

      const events = order.events;
      expect(events.length).toBeGreaterThan(0);

      const orderCreatedEvent = events.find((e: any) => e instanceof OrderCreated || e.constructor.name === 'OrderCreated');
      expect(orderCreatedEvent).toBeDefined();
    });

    it('should create domain event with correct aggregateId', () => {
      const item = OrderItem.create({ value: 'aggregate-test' }).getValue();

      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);
      const order = result.getValue();

      expect(order.id).toBeDefined();

      const events = order.events;
      const orderCreatedEvent = events[0] as OrderCreated;

      expect(orderCreatedEvent).toBeDefined();
      expect(orderCreatedEvent.aggregateId).toBe(order.id);
    });

    it('should create domain event with items data', () => {
      const item1 = OrderItem.create({ value: 'data-test-1' }).getValue();
      const item2 = OrderItem.create({ value: 'data-test-2' }).getValue();

      const props: OrderProps = {
        items: [item1, item2],
      };

      const result = Order.create(props);
      const order = result.getValue();

      const events = order.events;
      const orderCreatedEvent = events[0] as OrderCreated;

      expect(orderCreatedEvent.data).toBeDefined();
      expect(Array.isArray(orderCreatedEvent.data)).toBe(true);
      expect(orderCreatedEvent.data).toEqual([item1, item2]);
    });
  });

  describe('toJson', () => {
    it('should convert Order to JSON with items', () => {
      const item1 = OrderItem.create({ value: 'json-item-1' }).getValue();
      const item2 = OrderItem.create({ value: 'json-item-2' }).getValue();

      const props: OrderProps = {
        items: [item1, item2],
      };

      const result = Order.create(props);
      const order = result.getValue();

      const json = order.toJson();

      expect(json).toBeDefined();
      expect(json.items).toBeDefined();
      expect(Array.isArray(json.items)).toBe(true);
      expect(json.items).toHaveLength(2);
      expect(json.items[0].value).toBe('json-item-1');
      expect(json.items[1].value).toBe('json-item-2');
    });

    it('should convert Order with single item to JSON', () => {
      const item = OrderItem.create({ value: 'single-json-item' }).getValue();

      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);
      const order = result.getValue();

      const json = order.toJson();

      expect(json.items).toHaveLength(1);
      expect(json.items[0].value).toBe('single-json-item');
    });

    it('should convert Order with empty items to JSON', () => {
      const props: OrderProps = {
        items: [],
      };

      const result = Order.create(props);
      const order = result.getValue();

      const json = order.toJson();

      expect(json.items).toBeDefined();
      expect(json.items).toHaveLength(0);
      expect(Array.isArray(json.items)).toBe(true);
    });

    it('should log each item during toJson conversion', () => {
      const item1 = OrderItem.create({ value: 'log-item-1' }).getValue();
      const item2 = OrderItem.create({ value: 'log-item-2' }).getValue();

      const props: OrderProps = {
        items: [item1, item2],
      };

      const result = Order.create(props);
      const order = result.getValue();

      consoleLogSpy.mockClear();
      order.toJson();

      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenCalledWith('item: ', item1);
      expect(consoleLogSpy).toHaveBeenCalledWith('item: ', item2);
    });

    it('should map OrderItem to OrderItemProps correctly', () => {
      const item = OrderItem.create({ value: 'mapping-test' }).getValue();

      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);
      const order = result.getValue();

      const json = order.toJson();

      expect(json.items[0]).toEqual(item['props']);
      expect(json.items[0].value).toBe(item.value);
    });

    it('should preserve item order in JSON conversion', () => {
      const items = [
        OrderItem.create({ value: 'first' }).getValue(),
        OrderItem.create({ value: 'second' }).getValue(),
        OrderItem.create({ value: 'third' }).getValue(),
      ];

      const props: OrderProps = {
        items,
      };

      const result = Order.create(props);
      const order = result.getValue();

      const json = order.toJson();

      expect(json.items[0].value).toBe('first');
      expect(json.items[1].value).toBe('second');
      expect(json.items[2].value).toBe('third');
    });
  });

  describe('AggregateRoot behavior', () => {
    it('should be an AggregateRoot instance', () => {
      const item = OrderItem.create({ value: 'test' }).getValue();
      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);
      const order = result.getValue();

      expect(order).toBeDefined();
      expect(order.constructor.name).toBe('Order');
    });

    it('should have a unique ID', () => {
      const item = OrderItem.create({ value: 'id-test' }).getValue();
      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);
      const order = result.getValue();

      expect(order.id).toBeDefined();
      expect(order.id.id).toBeDefined();
      expect(typeof order.id.id).toBe('string');
    });

    it('should create different orders with different IDs', () => {
      const item1 = OrderItem.create({ value: 'order1-item' }).getValue();
      const item2 = OrderItem.create({ value: 'order2-item' }).getValue();

      const order1 = Order.create({ items: [item1] }).getValue();
      const order2 = Order.create({ items: [item2] }).getValue();

      expect(order1.id).not.toBe(order2.id);
      expect(order1.id.id).not.toBe(order2.id.id);
    });

    it('should have props property', () => {
      const item = OrderItem.create({ value: 'props-test' }).getValue();
      const props: OrderProps = {
        items: [item],
      };

      const result = Order.create(props);
      const order = result.getValue();

      expect(order['props']).toBeDefined();
      expect(order['props'].items).toBeDefined();
      expect(order['props'].items).toHaveLength(1);
    });
  });
});
