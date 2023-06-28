import { Result } from '@shared/core/Result';
import { Guard } from '@shared/core/Guard';
import { AggregateRoot } from '@shared/domain/AggregateRoot';

import { OrderItem, OrderItemProps } from './orderItem';

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
      items: this.props.items,
    };
  }

  public static create(props: OrderProps): Result<Order> {
    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: props.items, argumentName: 'items' }]);

    if (!guardResult.succeeded) return Result.fail<Order>(guardResult.message);

    const order = new Order({
      ...props,
    });

    return Result.ok<Order>(order);
  }
}
