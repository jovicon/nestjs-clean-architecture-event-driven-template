import { CreateProductUseCase } from '@modules/products/application/useCases/CreateProduct.usecase';
import { ProductInfrastructureModule } from './product.module';

describe('productInfrastructureModule', () => {
  it('should have ProductInfrastructureModule metadata', () => {
    const imports = Reflect.getMetadata('imports', ProductInfrastructureModule);
    const providers = Reflect.getMetadata('providers', ProductInfrastructureModule);
    const exports = Reflect.getMetadata('exports', ProductInfrastructureModule);

    expect(imports).toBeDefined();
    expect(providers).toBeDefined();
    expect(exports).toBeDefined();
  });

  it('should have CreateProductUseCase in providers', () => {
    const providers = Reflect.getMetadata('providers', ProductInfrastructureModule);

    expect(providers).toContain(CreateProductUseCase);
  });

  it('should export CreateProductUseCase', () => {
    const exports = Reflect.getMetadata('exports', ProductInfrastructureModule);

    expect(exports).toContain(CreateProductUseCase);
  });

  it('should have ProductServicePort provider', () => {
    const providers = Reflect.getMetadata('providers', ProductInfrastructureModule);

    const hasProductServicePort = providers.some(
      (provider: any) => provider.provide === 'ProductServicePort',
    );

    expect(hasProductServicePort).toBe(true);
  });

  it('should have imports defined', () => {
    const imports = Reflect.getMetadata('imports', ProductInfrastructureModule);

    expect(Array.isArray(imports)).toBe(true);
    expect(imports.length).toBeGreaterThan(0);
  });
});
