import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HttpAdapterService } from './http.service';

export const http = HttpModule.registerAsync({
  useFactory: () => ({
    timeout: 5000,
  }),
});

@Module({
  imports: [http],
  providers: [HttpAdapterService],
  exports: [HttpAdapterService],
})
export class HttpAdapterModule {}
