import { CoreModule } from './core/core.module';
import { FormulaOneModule } from './api/api.module';

const routes = [
  {
    path: '/f1',
    module: CoreModule,
    children: [
      {
        path: '/',
        module: FormulaOneModule,
      },
    ],
  },
];

export default routes;
