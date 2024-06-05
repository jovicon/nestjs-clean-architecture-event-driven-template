import { Injectable } from '@nestjs/common';
import { Responses } from '@base/src/shared/application/interfaces/responses';

@Injectable()
export default class CoreService {
  healthCheck(): Responses<null> {
    return {
      status: 'success',
      message: 'NestJS is working!!!',
    };
  }
}
