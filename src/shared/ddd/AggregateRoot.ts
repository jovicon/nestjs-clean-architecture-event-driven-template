import { EventEmitter2 } from '@nestjs/event-emitter';

import { Entity } from './Entity';
import { DomainEvent } from './DomainEvent.base';
import { RequestContextService } from '../application/context/AppRequestContext';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  private clearEvents(): void {
    this._domainEvents = [];
  }

  public async publishEvents(eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        console.log(
          `[${RequestContextService.getRequestId()}] "${event.constructor.name}" event published for aggregate ${
            this.constructor.name
          } : ${this.id}`
        );
        return eventEmitter.emitAsync(event.constructor.name, event);
      })
    );
    this.clearEvents();
  }
}
