import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponse } from '@shared/application/interfaces/http';
import { CreateLogUseCaseResponse } from '../../../useCases/SendQueuesMessage/CreateLog.dto';

import { ClientsService } from './api.service';
import { CreateLogDTO } from './api.dto';

@ApiTags('Logger')
@Controller()
export class ApiController {
  constructor(private readonly apiService: ClientsService) {}

  @Post('/')
  async saveLogs(@Body() body: CreateLogDTO): Promise<HttpResponse<CreateLogUseCaseResponse>> {
    const dto = {
      id: body.trackingId,
      item: body.items,
    };

    return this.apiService.createLog(dto);
  }
}
