import { OrderCreated } from '@base/src/modules/order/domain/events/orderCreated';
import { redBright } from 'cli-color';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';

type EventResponse = { success: boolean };

@Injectable()
export class OrderCreatedEventHandler {
  constructor(@Inject('LOGGER_SERVICE') private readonly clientLoggerService: ClientProxy) {}

  @OnEvent(OrderCreated.name, { async: true, promisify: true })
  async eventHandler(event: any): Promise<EventResponse> {
    console.log(redBright('[OrderCreated eventHandler] - Inside handler'));
    console.log(redBright('[OrderCreated eventHandler] - event: ', JSON.stringify(event)));

    // TODO: Reintentos en caso de fallbacks
    this.clientLoggerService.emit('createdOrder', event);

    return { success: true };
  }
}
