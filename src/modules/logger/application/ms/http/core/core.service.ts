import { Injectable } from '@nestjs/common';
import { HttpResponse } from '@shared/application/interfaces/http';

@Injectable()
export default class CoreService {
  healthCheck(): HttpResponse<null> {
    return {
      status: 'success',
      message: 'NestJS is working!!!',
    };
  }
}
