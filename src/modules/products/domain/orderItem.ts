import { ValueObject } from '@shared/ddd/ValueObject';
import { Result } from '@shared/commons/core/Result';
import { Guard } from '@shared/commons/Guard';

export interface OrderItemProps {
  value: string;
}

export class OrderItem extends ValueObject<OrderItemProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: OrderItemProps) {
    super(props);
  }

  public static create(props: OrderItemProps): Result<OrderItem> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'item');

    if (!nullGuardResult.succeeded) {
      return Result.fail<OrderItem>(nullGuardResult.message);
    }

    return Result.ok<OrderItem>(new OrderItem(props));
  }
}
