import { nanoid } from 'nanoid';

import { Guard } from '@shared/commons/Guard';

export type EventMetadata = {
  /** Timestamp when this domain event occurred */
  readonly timestamp: number;

  /** ID for correlation purposes (for Integration Events,logs correlation, etc).
   */
  readonly correlationId: string;

  /**
   * Causation id used to reconstruct execution order if needed
   */
  readonly causationId?: string;

  /**
   * User ID for debugging and logging purposes
   */
  readonly userId?: string;

  /**
   * User ID for debugging and logging purposes
   */
  readonly requestId?: string;
};

export type EventProps<T> = Omit<T, 'id' | 'metadata'> & {
  metadata?: EventMetadata;
};

export abstract class Event {
  public readonly id: string;

  public readonly metadata: EventMetadata;

  constructor(props: EventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new Error('DomainEvent props should not be empty');
    }

    this.id = nanoid(24);
    this.metadata = {
      correlationId: props?.metadata?.requestId,
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId,
    };
  }
}
