import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedDomainEvent } from '../domain/events/order-created.domain-event';

@Injectable()
export class OrderSagas {
  @OnEvent(OrderCreatedDomainEvent.name, { async: true, promisify: true })
  async Killed(): Promise<any> {
    console.log(clc.yellowBright('Inside [Killed] Saga'));
    return { success: true };
  }

  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<void> =>
    events$.pipe(
      ofType(OrderCreatedDomainEvent),
      delay(1000),
      map((event) => {
        console.log(clc.redBright('Inside [dragonKilled] Saga'), event);
      })
    );
}
