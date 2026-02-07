import type { Responses } from '@shared/application/interfaces/responses';

import { Injectable } from '@nestjs/common';

@Injectable()
export default class CoreService {
  healthCheck(): Responses<null> {
    return {
      status: 'success',
      message: 'NestJS is working!!!',
    };
  }
}
