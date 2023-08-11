import { DomainEvent, DomainEventProps } from '@shared/ddd';
import { OrderItem } from '../orderItem';

export class OrderCreatedDomainEvent extends DomainEvent {
  readonly data: OrderItem[];

  constructor(props: DomainEventProps<OrderCreatedDomainEvent>) {
    super(props);
    this.data = props.data;
  }
}
