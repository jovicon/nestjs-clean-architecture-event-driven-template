import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { HttpResponse } from '@application/interfaces/http';

import { CreateOrderController } from '../../useCases/CreateOrder/CreateOrder.controller';
import { CreateOrderDTO } from '../../useCases/CreateOrder/CreateOrder.dto';

@Injectable()
export default class ClientsService {
  constructor(
    private readonly createOrderController: CreateOrderController,
    @Inject('LOGGER_SERVICE') private clientLoggerService: ClientProxy
  ) {}

  async createOrder(dto: CreateOrderDTO): Promise<HttpResponse<any>> {
    const useCase = await this.createOrderController.execute(dto);

    this.clientLoggerService.emit('createdOrder', useCase);

    return {
      ...useCase,
    };
  }
}
