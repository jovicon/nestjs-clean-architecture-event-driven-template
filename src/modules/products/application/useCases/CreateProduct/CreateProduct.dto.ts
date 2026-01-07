import { Responses } from '@shared/application/interfaces/responses';

import { OrderJson } from '@modules/order/domain/order';

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
