import { CoreModule } from './core/core.module';

const loggerRoutes = [
  {
    path: '/logger',
    module: CoreModule,
  },
];

const allRoutes = [...loggerRoutes];

export default allRoutes;
