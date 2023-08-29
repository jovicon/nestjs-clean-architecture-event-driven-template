import { Injectable } from '@nestjs/common';

import { HttpResponse } from '@application/interfaces/http';

import { CreateOrderController } from '../../../useCases/CreateOrder/CreateOrder.controller';
import { CreateOrderDTO } from '../../../useCases/CreateOrder/CreateOrder.dto';

@Injectable()
export default class ClientsService {
  constructor(private readonly createOrderController: CreateOrderController) {}

  async createOrder(dto: CreateOrderDTO): Promise<HttpResponse<any>> {
    const useCase = await this.createOrderController.execute(dto);

    return {
      ...useCase,
    };
  }
}
