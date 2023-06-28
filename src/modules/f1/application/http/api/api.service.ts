import { Injectable } from '@nestjs/common';
import { HttpResponse } from '@application/interfaces/http';

import { GetSeasonByYearController } from '../../useCases/GetSeasonByYear/GetSeasonByYear.controller';
import { GetSeasonByYearDTO } from '../../useCases/GetSeasonByYear/GetSeasonByYear.dto';

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

  async getSeasonByYear(dto: GetSeasonByYearDTO): Promise<HttpResponse<any>> {
    const useCase = await this.getSeasonByYearController.execute(dto);

    return {
      ...useCase,
    };
  }
}
