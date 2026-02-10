import { Injectable } from '@nestjs/common'
import { Order } from '../../domain/order'
import { OrderItem } from '../../domain/orderItem'
import { UniqueEntityID } from '@shared/ddd/UniqueEntityID'
import { OrderDocument } from './order.schema'

interface Mapper<Entity, Domain> {
  toEntity: (domain: Domain) => Partial<Entity>
  toDomain: (entity: Entity) => Domain
}

@Injectable()
export class OrderMapper implements Mapper<OrderDocument, Order> {
  toEntity(domain: Order): Partial<OrderDocument> {
    if (!domain) {
      throw new Error('Domain Order cannot be null')
    }

    const orderJson = domain.toJson()
    // Don't send _id - let MongoDB generate ObjectId automatically
    return {
      items: orderJson.items.map(item => item.value),
    }
  }

  toDomain(document: OrderDocument): Order {
    if (!document) {
      throw new Error('Order document cannot be null')
    }

    // Reconstruir OrderItems
    const itemsResult = document.items.map(item => OrderItem.create({ value: item }))

    // Validar que todos los items se crearon correctamente
    const failures = itemsResult.filter(r => r.isFailure)
    if (failures.length > 0) {
      throw new Error(
        `Failed to reconstruct OrderItems: ${failures.map(f => f.errorValue()).join(', ')}`,
      )
    }

    const validItems = itemsResult.map(r => r.getValue())

    // Reconstruir Order con el ID de la base de datos
    const orderResult = Order.create(
      { items: validItems },
      new UniqueEntityID(document._id?.toString()),
    )

    if (orderResult.isFailure) {
      throw new Error(`Failed to reconstruct Order: ${orderResult.errorValue()}`)
    }

    return orderResult.getValue()
  }
}
