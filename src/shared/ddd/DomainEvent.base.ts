import { UniqueEntityID } from './UniqueEntityID';
import { EventMetadata, Event } from '@shared/commons/core/Event.base';

import { Guard } from '@shared/commons/Guard';

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: UniqueEntityID;
  metadata?: EventMetadata;
};

export abstract class DomainEvent extends Event {
  /** Aggregate ID where domain event occurred */
  public readonly aggregateId: UniqueEntityID;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new Error('DomainEvent props should not be empty');
    }
    super(props);

    this.aggregateId = props.aggregateId;
  }
}
