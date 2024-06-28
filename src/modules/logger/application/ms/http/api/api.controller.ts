import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Responses } from '@shared/application/interfaces/responses';
import { CreateLogUseCaseResponse } from '@modules/logger/application/useCases/SendQueuesMessage/CreateLog.dto';

import { ClientsService } from './api.service';
import { CreateLogDTO } from './api.dto';

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
