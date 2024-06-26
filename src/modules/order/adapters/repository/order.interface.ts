import { Repository } from '@shared/adapters/repository/interface';
import { OrderProps } from '@modules/order/domain/order';

export interface DataService {
  order: Repository<OrderProps>;
}
