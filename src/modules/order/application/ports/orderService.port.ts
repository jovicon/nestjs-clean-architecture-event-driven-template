import type { Order as OrderEntity } from '../../domain/order';

export interface CreateOrderDTO {
  items: string[];
}

export interface OrderServicePort {
  createOrder: (order: CreateOrderDTO, entity: OrderEntity) => Promise<CreateOrderDTO>;
}
