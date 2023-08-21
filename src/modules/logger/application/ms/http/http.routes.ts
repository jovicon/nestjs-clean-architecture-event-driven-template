import { CoreModule } from './core/core.module';
import { LoggerModule } from './api/api.module';

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
