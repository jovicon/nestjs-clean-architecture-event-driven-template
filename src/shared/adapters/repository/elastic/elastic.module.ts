import { Module } from '@nestjs/common';

import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { ElasticService } from './elastic.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        node: `https://${configService.providers.loggerModule.elasticHost}:${configService.providers.loggerModule.elasticPort}`,
        auth: {
          username: configService.providers.loggerModule.elasticUsername,
          password: configService.providers.loggerModule.elasticPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticAdapterModule {}
