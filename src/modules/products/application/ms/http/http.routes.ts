import { PATH_BASE_MS } from './http.config';
import { CoreModule } from './core/core.module';
import { OrderModule } from './api/api.module';

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
