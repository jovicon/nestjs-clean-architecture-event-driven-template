import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HttpAdapterService } from './http.service';

export const http = HttpModule.registerAsync({
  useFactory: () => ({
    timeout: 5000,
    maxRedirects: 5,
    baseURL: 'http://ergast.com/api/f1/',
  }),
});

@Module({
  imports: [http],
  providers: [HttpAdapterService],
  exports: [HttpAdapterService],
})
export class HttpAdapterModule {}
