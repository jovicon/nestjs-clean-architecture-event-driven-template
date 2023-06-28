import { Controller, Get, Post, Body, Inject, LoggerService, Param } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponse } from '@shared/application/interfaces/http';

import { GetSeasonByYearDTO, CreateClientDto } from './api.dto';
import ClientsService from './api.service';

@ApiTags('Formula one')
@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ClientsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @Post('/')
  save(@Body() body: CreateClientDto): HttpResponse<string> {
    return this.apiService.saveClient(body);
  }

  @Get('/season/:year')
  getSeasonByYear(@Param() body: GetSeasonByYearDTO): Promise<HttpResponse<string>> {
    const dto = {
      year: body.year,
    };

    return this.apiService.getSeasonByYear(dto);
  }
}
