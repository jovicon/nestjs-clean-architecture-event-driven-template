import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponse } from '@shared/application/interfaces/http';

import { ClientsService } from './api.service';
import { CreateLogDTO } from './api.dto';

@ApiTags('Logger')
@Controller()
export class ApiController {
  constructor(private readonly apiService: ClientsService) {}

  @Post('/')
  async saveLogs(@Body() body: CreateLogDTO): Promise<HttpResponse<string>> {
    const dto = {
      item: body.trackingId,
    };

    return this.apiService.createLog(dto);
  }
}
