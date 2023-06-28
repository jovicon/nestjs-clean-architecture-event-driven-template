import { Controller, Post, Inject, LoggerService, Body } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponse } from '@shared/application/interfaces/http';

import { CreateOrderDTO } from './api.dto';
import ClientsService from './api.service';

@ApiTags('Formula one')
@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ClientsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @Post('/')
  getSeasonByYear(@Body() body: CreateOrderDTO): Promise<HttpResponse<string>> {
    const dto = {
      items: body.items,
    };

    console.log('body', body);
    console.log('dto', dto);

    return this.apiService.getSeasonByYear(dto);
  }
}
