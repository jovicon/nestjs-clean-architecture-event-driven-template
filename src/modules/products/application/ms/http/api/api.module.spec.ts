import { ApiController } from './api.controller';
import { ProductModule } from './api.module';
import ClientsService from './api.service';

describe('productModule', () => {
  it('should have ProductModule metadata', () => {
    const imports = Reflect.getMetadata('imports', ProductModule);
    const controllers = Reflect.getMetadata('controllers', ProductModule);
    const providers = Reflect.getMetadata('providers', ProductModule);

    expect(imports).toBeDefined();
    expect(controllers).toContain(ApiController);
    expect(providers).toContain(ClientsService);
  });

  it('should have ApiController in controllers', () => {
    const controllers = Reflect.getMetadata('controllers', ProductModule);

    expect(controllers).toBeDefined();
    expect(controllers).toHaveLength(1);
    expect(controllers).toContain(ApiController);
  });

  it('should have ClientsService in providers', () => {
    const providers = Reflect.getMetadata('providers', ProductModule);

    expect(providers).toBeDefined();
    expect(providers).toContain(ClientsService);
  });
});
