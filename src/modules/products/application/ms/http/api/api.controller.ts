import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateProductUseCaseResponse } from '@modules/products/application/useCases/CreateProduct.usecase';

import { CreateOrderDTO } from './api.dto';
import ClientsService from './api.service';

@ApiTags('Products')
@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ClientsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @Post('/')
  createOrder(@Body() body: CreateOrderDTO): CreateProductUseCaseResponse {
    const dto = {
      items: body.items,
    };

    return this.apiService.createProduct(dto);
  }
}
