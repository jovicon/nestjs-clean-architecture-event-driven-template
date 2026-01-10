import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

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
