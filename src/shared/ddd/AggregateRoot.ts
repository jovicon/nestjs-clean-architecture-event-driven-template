import { EventEmitter2 } from '@nestjs/event-emitter';

import { Entity } from './Entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  public async publishEvents(eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.events.map(async (event) => {
        console.log(
          `[${this.requestId}] "${event.constructor.name}" event published for aggregate ${this.constructor.name} : ${this.id}`
        );
        return eventEmitter.emitAsync(event.constructor.name, event);
      })
    );
    this.clearEvents();
  }
}
