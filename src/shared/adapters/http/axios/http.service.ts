import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpAdapterService {
  constructor(private readonly http: HttpService) {}

  async get(path: string): Promise<any> {
    return this.http.get(path);
  }
}
