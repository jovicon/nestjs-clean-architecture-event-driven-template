import { CoreModule } from './core.module';
import CoreController from './core.controller';
import CoreService from './core.service';

describe('CoreModule (Order)', () => {
  it('should have CoreModule metadata', () => {
    const imports = Reflect.getMetadata('imports', CoreModule);
    const controllers = Reflect.getMetadata('controllers', CoreModule);
    const providers = Reflect.getMetadata('providers', CoreModule);

    expect(imports).toBeDefined();
    expect(controllers).toContain(CoreController);
    expect(providers).toContain(CoreService);
  });

  it('should have CoreController in controllers', () => {
    const controllers = Reflect.getMetadata('controllers', CoreModule);

    expect(controllers).toBeDefined();
    expect(controllers).toHaveLength(1);
    expect(controllers).toContain(CoreController);
  });

  it('should have CoreService in providers', () => {
    const providers = Reflect.getMetadata('providers', CoreModule);

    expect(providers).toBeDefined();
    expect(providers).toHaveLength(1);
    expect(providers).toContain(CoreService);
  });

  it('should have empty imports array', () => {
    const imports = Reflect.getMetadata('imports', CoreModule);

    expect(imports).toBeDefined();
    expect(imports).toHaveLength(0);
  });
});
