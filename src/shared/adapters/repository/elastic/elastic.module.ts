import { Module } from '@nestjs/common';

import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { ElasticService } from './elastic.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'https://localhost:9200',
      }),
    }),
  ],
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticAdapterModule {}
