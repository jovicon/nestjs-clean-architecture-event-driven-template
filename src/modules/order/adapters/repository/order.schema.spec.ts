import { Order, OrderSchema } from './order.schema';

describe('Order Schema (Order)', () => {
  describe('Order class', () => {
    it('should have items property', () => {
      const order = new Order();
      order.items = ['item1', 'item2'];

      expect(order.items).toEqual(['item1', 'item2']);
    });

    it('should handle empty items array', () => {
      const order = new Order();
      order.items = [];

      expect(order.items).toHaveLength(0);
    });

    it('should handle single item', () => {
      const order = new Order();
      order.items = ['single-item'];

      expect(order.items).toHaveLength(1);
      expect(order.items[0]).toBe('single-item');
    });

    it('should handle items with special characters', () => {
      const order = new Order();
      order.items = ['item-@#$%', 'item-日本語'];

      expect(order.items).toContain('item-@#$%');
      expect(order.items).toContain('item-日本語');
    });
  });

  describe('OrderSchema', () => {
    it('should be defined', () => {
      expect(OrderSchema).toBeDefined();
    });

    it('should be a valid Mongoose schema', () => {
      expect(OrderSchema.paths).toBeDefined();
    });

    it('should have items path', () => {
      expect(OrderSchema.paths.items).toBeDefined();
    });
  });
});
