import { Result } from '@shared/commons/core/Result'
import { Guard } from '@shared/commons/Guard'
import type { OrderItem, OrderItemProps } from './orderItem'

import { AggregateRoot } from '@shared/ddd/AggregateRoot'
import { UniqueEntityID } from '@shared/ddd/UniqueEntityID'
import { OrderCreated } from './events/orderCreated'

export interface OrderProps {
  items: OrderItem[]
}

export interface OrderJson {
  id: string
  items: OrderItemProps[]
}

export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id)
  }

  toJson(): OrderJson {
    return {
      id: this._id.id,
      items: this.props.items.map((item: OrderItem) => {
        return item.props
      }),
    }
  }

  public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {
    const propsGuardResult = Guard.againstNullOrUndefined(props, 'props')

    if (!propsGuardResult.succeeded) {
      return Result.fail<Order>(propsGuardResult.message)
    }

    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: props.items, argumentName: 'items' }])

    if (!guardResult.succeeded)
      return Result.fail<Order>(guardResult.message)

    const order = new Order(props, id)

    const domainEvent = new OrderCreated({
      aggregateId: order.id,
      data: props.items,
    })

    order.addEvent(domainEvent)

    return Result.ok<Order>(order)
  }
}
