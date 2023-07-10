import { Module } from '@nestjs/common';

import { MongoRepositoryService } from './mongoose.service';

@Module({
  imports: [],
  providers: [MongoRepositoryService],
  exports: [MongoRepositoryService],
})
export class MongooseAdapterModule {}
