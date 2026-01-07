import { OrderModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { PATH_BASE_MS } from './http.config';

const orderRoutes = [
  {
    path: `/${PATH_BASE_MS}`,
    module: CoreModule,
    children: [
      {
        path: '/',
        module: OrderModule,
      },
    ],
  },
];

const allRoutes = [...orderRoutes];

export { allRoutes };
