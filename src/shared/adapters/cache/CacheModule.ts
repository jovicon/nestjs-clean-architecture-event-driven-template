import { Module } from '@nestjs/common';

import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
  // imports: [
  //   CacheModule.registerAsync({
  //     useFactory: async () => {
  //       const store = new Keyv(new KeyvRedis('redis://redis:redis@localhost:6379'));
  //       return {
  //         store: store as unknown as CacheStore,
  //         ttl: 3 * 60000,
  //       };
  //     },
  //   }),
  // ],
})
export class InternalCacheModule {}
