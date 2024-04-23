import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event } from './Event.base';

import { RequestContextService } from '@shared/application/context/AppRequestContext';

export abstract class EventHandler {
  protected requestId: string = RequestContextService.getRequestId();

  private _events: Event[] = [];

  get events(): Event[] {
    return this._events;
  }

  protected addEvent(event: Event): void {
    this._events.push(event);
  }

  protected clearEvents(): void {
    this._events = [];
  }

  public async publishEvents(eventEmitter: EventEmitter2, handlers: string[]): Promise<void> {
    await Promise.all(
      this.events.map(async (event) => {
        handlers.forEach((handler) => {
          console.log(`[${this.requestId}] -- publishing events on handler: `, handler);
          eventEmitter.emitAsync(handler, event);
        });
      })
    );

    this.clearEvents();
  }
}
