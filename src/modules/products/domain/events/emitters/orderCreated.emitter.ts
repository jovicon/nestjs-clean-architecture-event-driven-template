import type { OrderItem } from '@modules/order/domain/orderItem';
import type { DomainEventProps } from '@shared/ddd';

import { DomainEvent } from '@shared/ddd';

export class OrderCreated extends DomainEvent {
  readonly data: OrderItem[];

  constructor(props: DomainEventProps<OrderCreated>) {
    super(props);
    this.data = props.data;
  }
}
