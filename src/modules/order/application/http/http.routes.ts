import { CoreModule } from './core/core.module';
import { OrderModule } from './api/api.module';

const orderRoutes = [
  {
    path: '/order',
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

const badcode = [];

export default allRoutes;
