import { Injectable } from '@nestjs/common';
import * as clc from 'cli-color';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedDomainEvent } from '../emitters/orderCreated.emitter';

@Injectable()
export class OrderCreatedEventHandler {
  @OnEvent(OrderCreatedDomainEvent.name, { async: true, promisify: true })
  async eventHandler(): Promise<any> {
    console.log(clc.redBright('[OrderCreated eventHandler] - Inside handler'));
    return { success: true };
  }
}
