import { Injectable } from '@nestjs/common';
import { HttpResponse } from '@application/interfaces/http';

import { GetSeasonByYearController } from '../../useCases/CreateOrder/CreateOrder.controller';
import { CreateOrderDTO } from '../../useCases/CreateOrder/CreateOrder.dto';

@Injectable()
export default class ClientsService {
  constructor(private readonly getSeasonByYearController: GetSeasonByYearController) {}

  saveClient(client: any): HttpResponse<any> {
    return {
      status: 'success',
      message: 'saved client',
      data: {
        ...client,
      },
    };
  }

  async getSeasonByYear(dto: CreateOrderDTO): Promise<HttpResponse<any>> {
    const useCase = await this.getSeasonByYearController.execute(dto);

    return {
      ...useCase,
    };
  }
}
