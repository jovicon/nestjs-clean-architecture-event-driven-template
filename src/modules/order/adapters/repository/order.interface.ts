import type { OrderProps } from '@modules/order/domain/order';

import type { Repository } from '@shared/adapters/repository/Repository.port';

export interface DataService {
  order: Repository<OrderProps>;
}
