import { ApiController } from './api.controller';
import { OrderModule } from './api.module';
import ClientsService from './api.service';

describe('orderModule', () => {
  it('should have OrderModule metadata', () => {
    const imports = Reflect.getMetadata('imports', OrderModule);
    const controllers = Reflect.getMetadata('controllers', OrderModule);
    const providers = Reflect.getMetadata('providers', OrderModule);

    expect(imports).toBeDefined();
    expect(controllers).toContain(ApiController);
    expect(providers).toContain(ClientsService);
  });

  it('should have ApiController in controllers', () => {
    const controllers = Reflect.getMetadata('controllers', OrderModule);

    expect(controllers).toBeDefined();
    expect(controllers).toHaveLength(1);
    expect(controllers).toContain(ApiController);
  });

  it('should have ClientsService in providers', () => {
    const providers = Reflect.getMetadata('providers', OrderModule);

    expect(providers).toBeDefined();
    expect(providers).toContain(ClientsService);
  });
});
