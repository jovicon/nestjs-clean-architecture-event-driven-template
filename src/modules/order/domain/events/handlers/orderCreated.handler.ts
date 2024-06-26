import * as clc from 'cli-color';

import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OnEvent } from '@nestjs/event-emitter';

import { OrderCreated } from '@base/src/modules/order/domain/events/emitters/orderCreated.emitter';

type EventResponse = { success: boolean };

@Injectable()
export class OrderCreatedEventHandler {
  constructor(@Inject('LOGGER_SERVICE') private clientLoggerService: ClientProxy) {}

  @OnEvent(OrderCreated.name, { async: true, promisify: true })
  async eventHandler(event: any): Promise<EventResponse> {
    console.log(clc.redBright('[OrderCreated eventHandler] - Inside handler'));
    console.log(clc.redBright('[OrderCreated eventHandler] - event: ', JSON.stringify(event)));

    // TODO: Reintentos en caso de fallbacks
    this.clientLoggerService.emit('createdOrder', event);

    return { success: true };
  }
}
