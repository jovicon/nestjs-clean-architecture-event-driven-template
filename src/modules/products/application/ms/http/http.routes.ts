import { ProductModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { PATH_BASE_MS } from './http.config';

const productRoutes = [
  {
    path: `/${PATH_BASE_MS}`,
    module: CoreModule,
    children: [
      {
        path: '/',
        module: ProductModule,
      },
    ],
  },
];

const allRoutes = [...productRoutes];

export { allRoutes };
