import type { Responses } from '@shared/application/interfaces/responses';

import { Injectable } from '@nestjs/common';

@Injectable()
class CoreService {
  healthCheck(): Responses<null> {
    return {
      status: 'success',
      message: 'NestJS is working!!!',
    };
  }
}

export { CoreService };
