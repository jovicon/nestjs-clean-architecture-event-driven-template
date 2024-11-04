import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/commons/core/UseCase';

import { ElasticService } from '@shared/adapters/repository/elastic/elastic.service';

import { CreateLogDTO, CreateLogUseCaseResponse } from './CreateLog.dto';
import { Responses } from '@shared/application/interfaces/responses';

@Injectable()
export class CreateLogUseCase implements UseCase<CreateLogDTO, Promise<Responses<CreateLogUseCaseResponse>>> {
  constructor(private readonly elasticService: ElasticService) {}

  public async execute(dto: CreateLogDTO): Promise<Responses<CreateLogUseCaseResponse>> {
    console.log('CreateLogUseCase - DTO: ', dto);

    const log = {
      id: dto.id,
      item: dto,
    };

    console.log('CreateLogUseCase - LOG: ', log);
    try {
      await this.elasticService.create(log);
      return {
        status: 'success',
        message: 'created order',
        data: {},
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'error creating order',
        data: {
          error: error?.message,
        },
      };
    }
  }
}
