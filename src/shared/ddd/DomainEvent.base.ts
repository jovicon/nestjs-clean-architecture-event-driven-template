import { nanoid } from 'nanoid';

import { UniqueEntityID } from './UniqueEntityID';
import { EventMetadata } from '@shared/core/Event.base';
import { RequestContextService } from '@shared/application/context/AppRequestContext';

import { Guard } from '@shared/core/guard';

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: UniqueEntityID;
  metadata?: EventMetadata;
};

export abstract class DomainEvent {
  public readonly id: string;

  /** Aggregate ID where domain event occurred */
  public readonly aggregateId: UniqueEntityID;

  public readonly metadata: EventMetadata;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new Error('DomainEvent props should not be empty');
    }

    this.id = nanoid(24);
    this.aggregateId = props.aggregateId;
    this.metadata = {
      correlationId: props?.metadata?.correlationId || RequestContextService.getRequestId(),
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId,
    };
  }
}
