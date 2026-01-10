import { Order as OrderEntity } from '../../domain/order';

export interface CreateOrderDTO {
  items: string[];
}

export interface ProductServicePort {
  createOrder(order: CreateOrderDTO, entity: OrderEntity): Promise<CreateOrderDTO>;
}
