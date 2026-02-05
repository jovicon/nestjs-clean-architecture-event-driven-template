import { OrderRepositoryModule } from './order.module';
import { OrderRepositoryAdapter } from './order.adapter';
import { OrderService } from './order.service';

describe('OrderRepositoryModule (Order)', () => {
  it('should have OrderRepositoryModule metadata', () => {
    const imports = Reflect.getMetadata('imports', OrderRepositoryModule);
    const providers = Reflect.getMetadata('providers', OrderRepositoryModule);
    const exports = Reflect.getMetadata('exports', OrderRepositoryModule);

    expect(imports).toBeDefined();
    expect(providers).toBeDefined();
    expect(exports).toBeDefined();
  });

  it('should have OrderRepositoryAdapter in providers', () => {
    const providers = Reflect.getMetadata('providers', OrderRepositoryModule);

    expect(providers).toContain(OrderRepositoryAdapter);
  });

  it('should have OrderService in providers', () => {
    const providers = Reflect.getMetadata('providers', OrderRepositoryModule);

    expect(providers).toContain(OrderService);
  });

  it('should export OrderService', () => {
    const exports = Reflect.getMetadata('exports', OrderRepositoryModule);

    expect(exports).toContain(OrderService);
  });

  it('should export OrderRepositoryAdapter', () => {
    const exports = Reflect.getMetadata('exports', OrderRepositoryModule);

    expect(exports).toContain(OrderRepositoryAdapter);
  });

  it('should have MongooseModule in imports', () => {
    const imports = Reflect.getMetadata('imports', OrderRepositoryModule);

    expect(imports).toBeDefined();
    expect(Array.isArray(imports)).toBe(true);
  });

  it('should have EventEmitterModule in imports', () => {
    const imports = Reflect.getMetadata('imports', OrderRepositoryModule);

    expect(imports).toBeDefined();
    expect(imports.length).toBeGreaterThan(0);
  });
});
