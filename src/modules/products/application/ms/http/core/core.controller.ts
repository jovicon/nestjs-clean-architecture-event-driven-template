import type { Responses } from '@shared/application/interfaces/responses';

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import CoreService from './core.service';

@ApiTags('core')
@Controller()
export default class CoreController {
  constructor(private readonly appService: CoreService) {}

  @Get('health')
  healthCheck(): Responses<null> {
    return this.appService.healthCheck();
  }
}
