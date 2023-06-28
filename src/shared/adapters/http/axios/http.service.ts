import { Injectable } from '@nestjs/common';
// import { HttpResponse } from '@shared/application/interfaces/http';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpAdapterService {
  constructor(private readonly http: HttpService) {}

  async get(path: string): Promise<any> {
    return this.http.get(path);
  }

  // post(): HttpResponse<string> {
  //   return {
  //     status: 'success',
  //     message: 'NestJS is working!!!',
  //     data: 'example data',
  //   };
  // }
}
