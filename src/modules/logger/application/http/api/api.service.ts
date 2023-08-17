import { Injectable } from '@nestjs/common';
import { HttpResponse } from '@application/interfaces/http';

@Injectable()
export default class ClientsService {
  saveClient(client: any): HttpResponse<any> {
    return {
      status: 'success',
      message: 'saved client',
      data: {
        ...client,
      },
    };
  }

  async getSeasonByYear(): Promise<void> {
    console.log('getSeasonByYear Logger');
  }
}
