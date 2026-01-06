import { Order as OrderSchema } from '../../adapters/repository/order.schema';
import { Order as OrderEntity } from '../../domain/order';

export interface IOrderService {
  getAllOrders(): Promise<OrderSchema[]>;
  getOrderById(id: string): Promise<OrderSchema>;
  createOrder(order: OrderSchema, entity: OrderEntity): Promise<OrderSchema>;
}
