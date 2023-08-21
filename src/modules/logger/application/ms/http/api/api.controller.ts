import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponse } from '@shared/application/interfaces/http';

@ApiTags('Logger')
@Controller()
export class ApiController {
  @Post('/')
  async saveLogs(): Promise<HttpResponse<string>> {
    return {
      status: 'success',
      message: 'logger ok',
      data: 'string',
    };
  }
}
