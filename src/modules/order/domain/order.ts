import type { OrderItem, OrderItemProps } from './orderItem';
import { Result } from '@shared/commons/core/Result';
import { Guard } from '@shared/commons/Guard';

import { AggregateRoot } from '@shared/ddd/AggregateRoot';
import { OrderCreated } from './events/orderCreated';

export interface OrderProps {
  items: OrderItem[];
}

export interface OrderJson {
  items: OrderItemProps[];
}

export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps) {
    super(props);
  }

  toJson(): OrderJson {
    return {
      items: this.props.items.map((item: OrderItem) => {
        console.log('item: ', item);
        return item.props;
      }),
    };
  }

  public static create(props: OrderProps): Result<Order> {
    const propsGuardResult = Guard.againstNullOrUndefined(props, 'props');

    if (!propsGuardResult.succeeded) {
      return Result.fail<Order>(propsGuardResult.message);
    }

    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: props.items, argumentName: 'items' }]);

    if (!guardResult.succeeded)
      return Result.fail<Order>(guardResult.message);

    const order = new Order({
      ...props,
    });

    const domainEvent = new OrderCreated({
      aggregateId: order.id,
      data: props.items,
    });

    order.addEvent(domainEvent);

    return Result.ok<Order>(order);
  }
}
