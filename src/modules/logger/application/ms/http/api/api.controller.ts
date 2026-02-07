import type { CreateLogUseCaseResponse } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';
import type { Responses } from '@shared/application/interfaces/responses';
import type { CreateLogDTO } from './api.dto';

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ClientsService } from './api.service';

@ApiTags('Logger')
@Controller()
export class ApiController {
  constructor(private readonly apiService: ClientsService) {}

  @Post('/')
  async saveLogs(@Body() body: CreateLogDTO): Promise<Responses<CreateLogUseCaseResponse>> {
    const dto = {
      id: body.trackingId,
      item: body.items,
    };

    return this.apiService.createLog(dto);
  }
}
