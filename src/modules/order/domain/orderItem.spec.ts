import type { OrderItemProps } from './orderItem';
import { OrderItem } from './orderItem';

describe('orderItem', () => {
  describe('create', () => {
    it('should create a valid OrderItem with a string value', () => {
      const props: OrderItemProps = {
        value: 'test-item-value',
      };

      const result = OrderItem.create(props);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);

      const orderItem = result.getValue();
      expect(orderItem).toBeDefined();
      expect(orderItem.value).toBe('test-item-value');
    });

    it('should create OrderItem with empty string value', () => {
      const props: OrderItemProps = {
        value: '',
      };

      const result = OrderItem.create(props);

      expect(result.isSuccess).toBe(true);
      const orderItem = result.getValue();
      expect(orderItem.value).toBe('');
    });

    it('should create OrderItem with numeric string', () => {
      const props: OrderItemProps = {
        value: '12345',
      };

      const result = OrderItem.create(props);

      expect(result.isSuccess).toBe(true);
      const orderItem = result.getValue();
      expect(orderItem.value).toBe('12345');
    });

    it('should create OrderItem with special characters', () => {
      const props: OrderItemProps = {
        value: 'item-with-@special#characters!',
      };

      const result = OrderItem.create(props);

      expect(result.isSuccess).toBe(true);
      const orderItem = result.getValue();
      expect(orderItem.value).toBe('item-with-@special#characters!');
    });

    it('should fail when value is null', () => {
      const props: OrderItemProps = {
        value: null as any,
      };

      const result = OrderItem.create(props);

      expect(result.isFailure).toBe(true);
      expect(result.isSuccess).toBe(false);
      expect(() => result.getValue()).toThrow();
      expect(result.errorValue()).toContain('item');
    });

    it('should fail when value is undefined', () => {
      const props: OrderItemProps = {
        value: undefined as any,
      };

      const result = OrderItem.create(props);

      expect(result.isFailure).toBe(true);
      expect(result.isSuccess).toBe(false);
      expect(() => result.getValue()).toThrow();
      expect(result.errorValue()).toContain('item');
    });

    it('should fail when props object is null', () => {
      const result = OrderItem.create(null as any);

      expect(result.isFailure).toBe(true);
      expect(() => result.getValue()).toThrow();
    });

    it('should fail when props object is undefined', () => {
      const result = OrderItem.create(undefined as any);

      expect(result.isFailure).toBe(true);
      expect(() => result.getValue()).toThrow();
    });
  });

  describe('value getter', () => {
    it('should return the correct value via getter', () => {
      const props: OrderItemProps = {
        value: 'getter-test-value',
      };

      const result = OrderItem.create(props);
      const orderItem = result.getValue();

      expect(orderItem.value).toBe('getter-test-value');
    });

    it('should return props.value directly', () => {
      const props: OrderItemProps = {
        value: 'direct-access-test',
      };

      const result = OrderItem.create(props);
      const orderItem = result.getValue();

      expect(orderItem.value).toBe(orderItem.props.value);
    });
  });

  describe('valueObject behavior', () => {
    it('should be a ValueObject instance', () => {
      const props: OrderItemProps = {
        value: 'test',
      };

      const result = OrderItem.create(props);
      const orderItem = result.getValue();

      expect(orderItem).toBeDefined();
      expect(orderItem.constructor.name).toBe('OrderItem');
    });

    it('should have props property', () => {
      const props: OrderItemProps = {
        value: 'test',
      };

      const result = OrderItem.create(props);
      const orderItem = result.getValue();

      expect(orderItem.props).toBeDefined();
      expect(orderItem.props.value).toBe('test');
    });
  });
});
