import { EventEmitter2 } from '@nestjs/event-emitter';
// import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LoggerPort } from '@shared/ports/logger.port';

import { Entity } from './Entity';
import { DomainEvent } from './domain-event.base';
import { RequestContextService } from '../application/context/AppRequestContext';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public async publishEvents(logger: LoggerPort, eventEmitter: EventEmitter2): Promise<void> {
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
