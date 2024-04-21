import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpAdapterService {
  constructor(private readonly http: HttpService) {}

  async get(path: string, config: AxiosRequestConfig = {}): Promise<any> {
    return this.http.get(path, config);
  }

  async post(path: string, body: any, config: AxiosRequestConfig = {}): Promise<any> {
    return this.http.post(path, body, config);
  }

  async put(path: string, body: any, config: AxiosRequestConfig = {}): Promise<any> {
    return this.http.put(path, body, config);
  }
}
