import { Repository } from '@shared/adapters/repository/Repository.port';

import { OrderProps } from '@modules/order/domain/order';

export interface DataService {
  order: Repository<OrderProps>;
}
