import type { Order as OrderEntity } from '../../domain/order'

export interface CreateOrderDTO {
  items: string[]
}

export interface OrderRepositoryPort {
  save: (order: OrderEntity) => Promise<OrderEntity>
  // findById: (id: string) => Promise<OrderEntity | null>
  // findAll: () => Promise<OrderEntity[]>
  // delete: (id: string) => Promise<void>
}
