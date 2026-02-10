import type { Order as OrderEntity } from '@modules/order/domain/order'
import type { OrderRepositoryPort } from '../../application/ports/orderRepository.port'
import type { OrderDocument } from './order.schema'

import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { OrderDataSource } from './order.adapter'
import { OrderMapper } from './order.mapper'

@Injectable()
export class OrderRepository implements OrderRepositoryPort {
  constructor(
    private readonly dataSource: OrderDataSource,
    private readonly mapper: OrderMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async save(entity: OrderEntity): Promise<OrderEntity> {
    // Convert domain entity to persistence format
    const orderData = this.mapper.toEntity(entity)

    // Save to database - MongoDB will generate ObjectId automatically
    // Don't send _id, let MongoDB handle it
    const savedDocument = await this.dataSource.orders.create({
      items: orderData.items,
    })

    // Reconstruct domain entity from saved document with MongoDB-generated _id
    const reconstructedOrder = this.mapper.toDomain(savedDocument as OrderDocument)

    // Publish domain events from the original entity
    await reconstructedOrder.publishEvents(this.eventEmitter)

    return reconstructedOrder
  }
}
