import { Controller, Post, Inject, LoggerService, Body } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiTags } from '@nestjs/swagger';

import { CreateOrderUseCaseResponse } from '@modules/products/application/useCases/CreateProduct/CreateProduct.dto';

import { CreateOrderDTO } from './api.dto';
import ClientsService from './api.service';

@ApiTags('Orders')
@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ClientsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @Post('/')
  createOrder(@Body() body: CreateOrderDTO): CreateOrderUseCaseResponse {
    const dto = {
      items: body.items,
    };

    return this.apiService.createOrder(dto);
  }
}
