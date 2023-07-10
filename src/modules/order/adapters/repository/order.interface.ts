import { Repository } from '@shared/adapters/repository/interface';
import { OrderProps } from '../../domain/order';

export interface DataService {
  order: Repository<OrderProps>;
}
