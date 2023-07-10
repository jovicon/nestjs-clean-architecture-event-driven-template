import { Status } from '@shared/application/types/web_server';

export interface HttpResponse<T> {
  status: Status;
  message: string;
  data?: T;
}
