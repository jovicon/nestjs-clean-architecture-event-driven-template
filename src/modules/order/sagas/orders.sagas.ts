import { Injectable } from '@nestjs/common';
import * as clc from 'cli-color';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedDomainEvent } from '../domain/events/order-created.domain-event';

@Injectable()
export class OrderSagas {
  @OnEvent(OrderCreatedDomainEvent.name, { async: true, promisify: true })
  async Killed(): Promise<any> {
    console.log(clc.yellowBright('Inside [Killed] Saga'));
    return { success: true };
  }
}
