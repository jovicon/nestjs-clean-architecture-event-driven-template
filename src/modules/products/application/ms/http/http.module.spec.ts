import { HttpModule } from './http.module';
import { CoreModule } from './core/core.module';
import { ProductModule } from './api/api.module';

describe('HttpModule (Products)', () => {
  it('should have HttpModule metadata', () => {
    const imports = Reflect.getMetadata('imports', HttpModule);
    const providers = Reflect.getMetadata('providers', HttpModule);

    expect(imports).toBeDefined();
    expect(providers).toBeDefined();
  });

  it('should import CoreModule', () => {
    const imports = Reflect.getMetadata('imports', HttpModule);

    expect(imports).toContain(CoreModule);
  });

  it('should import ProductModule', () => {
    const imports = Reflect.getMetadata('imports', HttpModule);

    expect(imports).toContain(ProductModule);
  });

  it('should have providers defined', () => {
    const providers = Reflect.getMetadata('providers', HttpModule);

    expect(providers).toBeDefined();
    expect(Array.isArray(providers)).toBe(true);
  });

  it('should have interceptors in providers', () => {
    const providers = Reflect.getMetadata('providers', HttpModule);

    const hasInterceptor = providers.some(
      (provider: any) => provider.provide === 'APP_INTERCEPTOR' || provider.useClass
    );

    expect(hasInterceptor).toBe(true);
  });

  it('should have LOGGER_SERVICE provider', () => {
    const providers = Reflect.getMetadata('providers', HttpModule);

    const hasLoggerService = providers.some((provider: any) => provider.provide === 'LOGGER_SERVICE');

    expect(hasLoggerService).toBe(true);
  });
});
