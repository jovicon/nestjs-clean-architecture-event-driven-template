import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/core/UseCase';

import { ElasticService } from '@shared/adapters/repository/elastic/elastic.service';

import { CreateLogDTO } from './SendQueuesMessage.dto';

@Injectable()
export class SendQueuesMessageUseCase implements UseCase<CreateLogDTO, Promise<any>> {
  constructor(private readonly elasticService: ElasticService<any>) {}

  public async execute(dto: CreateLogDTO): Promise<any> {
    console.log('SendQueuesMessageUseCase', dto);

    try {
      await this.elasticService.create(dto);
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
