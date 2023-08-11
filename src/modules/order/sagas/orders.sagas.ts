import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HeroKilledDragonEvent } from '../events/impl/hero-killed-dragon.event';

@Injectable()
export class HeroesGameSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> =>
    events$.pipe(
      ofType(HeroKilledDragonEvent),
      delay(1000),
      map((event) => {
        console.log(clc.redBright('Inside [OrdersSagas] Saga'), event);
      })
    );
}
