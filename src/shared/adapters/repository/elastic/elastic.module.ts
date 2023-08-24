import { Module } from '@nestjs/common';

import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { ElasticService } from './elastic.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'https://localhost:9200',
        auth: {
          username: 'elastic',
          password: 'afsjjdfoeiwjif',
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticAdapterModule {}
