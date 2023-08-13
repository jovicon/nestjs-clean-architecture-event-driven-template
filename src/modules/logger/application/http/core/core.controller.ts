import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponse } from '@shared/application/interfaces/http';

import CoreService from './core.service';

@ApiTags('core')
@Controller()
export default class CoreController {
  constructor(private readonly appService: CoreService) {}

  @Get('health')
  healthCheck(): HttpResponse<null> {
    return this.appService.healthCheck();
  }
}
