import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OnEvent } from '@nestjs/event-emitter';

import * as clc from 'cli-color';

import { OrderCreatedDomainEvent } from '../emitters/orderCreated.emitter';

@Injectable()
export class OrderCreatedEventHandler {
  constructor(@Inject('LOGGER_SERVICE') private clientLoggerService: ClientProxy) {}

  @OnEvent(OrderCreatedDomainEvent.name, { async: true, promisify: true })
  async eventHandler(event: any): Promise<any> {
    console.log(clc.redBright('[OrderCreated eventHandler] - Inside handler'));
    console.log(clc.redBright('[OrderCreated eventHandler] - event: ', JSON.stringify(event)));

    this.clientLoggerService.emit('createdOrder', event);

    return { success: true };
  }
}
