import { DomainEvent, DomainEventProps } from '@shared/ddd';
import { OrderItem } from '@modules/order/domain/orderItem';

export class OrderCreated extends DomainEvent {
  readonly data: OrderItem[];

  constructor(props: DomainEventProps<OrderCreated>) {
    super(props);
    this.data = props.data;
  }
}
