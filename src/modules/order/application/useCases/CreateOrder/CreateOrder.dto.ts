import { OrderJson } from '@modules/order/domain/order';
import { Responses } from '@base/src/shared/application/interfaces/responses';

export interface CreateOrderDTO {
  items: string[];
}

type CreateOrderSuccess = {
  orderValidated: OrderJson;
};

type CreateOrderError = {
  error: string;
};

export type CreateOrderUseCaseResponse = Promise<Responses<CreateOrderSuccess | CreateOrderError>>;
