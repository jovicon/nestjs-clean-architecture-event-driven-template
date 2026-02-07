import type { CreateProductUseCaseResponse } from '@modules/products/application/useCases/CreateProduct.usecase';
import type { LoggerService } from '@nestjs/common';
import type { CreateOrderDTO } from './api.dto';

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import ClientsService from './api.service';

@ApiTags('Products')
@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ClientsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  @Post('/')
  createOrder(@Body() body: CreateOrderDTO): CreateProductUseCaseResponse {
    const dto = {
      items: body.items,
    };

    return this.apiService.createProduct(dto);
  }
}
