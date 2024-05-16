import { OrderJson } from '@modules/order/domain/order';
import { HttpResponse } from '@base/src/shared/application/interfaces/http';

export interface CreateOrderDTO {
  items: string[];
}

type CreateOrderSuccess = {
  orderValidated: OrderJson;
};

type CreateOrderError = {
  error: string;
};

export type CreateOrderUseCaseResponse = Promise<HttpResponse<CreateOrderSuccess | CreateOrderError>>;
