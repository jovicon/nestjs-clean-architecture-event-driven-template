import { LoggerModule } from './api/api.module';
import { CoreModule } from './core/core.module';

const loggerRoutes = [
  {
    path: '/logger',
    module: CoreModule,
    children: [
      {
        path: '/',
        module: LoggerModule,
      },
    ],
  },
];

const allRoutes = [...loggerRoutes];

export default allRoutes;
