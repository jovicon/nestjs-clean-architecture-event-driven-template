import { CoreModule } from './core/core.module';
import { OrderModule } from './api/api.module';

const routes = [
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

const routesFlat = [];

export default routes;
