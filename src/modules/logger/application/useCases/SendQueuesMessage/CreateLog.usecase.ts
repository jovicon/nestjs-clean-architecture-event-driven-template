import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/core/UseCase';

import { ElasticService } from '@shared/adapters/repository/elastic/elastic.service';

import { CreateLogDTO } from './CreateLog.dto';

@Injectable()
export class CreateLogUseCase implements UseCase<CreateLogDTO, Promise<any>> {
  constructor(private readonly elasticService: ElasticService) {}

  public async execute(dto: CreateLogDTO): Promise<any> {
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
    } catch (err: any) {
      return {
        status: 'error',
        message: 'error creating order',
        data: {
          error: err.message,
        },
      };
    }
  }
}
