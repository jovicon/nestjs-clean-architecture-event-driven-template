import { Result } from '@shared/commons/core/Result';
import { Guard } from '@shared/commons/Guard';
import { ValueObject } from '@shared/ddd/ValueObject';

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
    const propsGuardResult = Guard.againstNullOrUndefined(props, 'props');

    if (!propsGuardResult.succeeded) {
      return Result.fail<OrderItem>(propsGuardResult.message);
    }

    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'item');

    if (!nullGuardResult.succeeded) {
      return Result.fail<OrderItem>(nullGuardResult.message);
    }

    return Result.ok<OrderItem>(new OrderItem(props));
  }
}
