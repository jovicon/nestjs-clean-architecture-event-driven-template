import { Status } from '@shared/application/types/status';

export interface Responses<T> {
  status: Status;
  message: string;
  data?: T;
}

export interface HttpResponse<T> {
  status: number;
  body: Responses<T>;
}
