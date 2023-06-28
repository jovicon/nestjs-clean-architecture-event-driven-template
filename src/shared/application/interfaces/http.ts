import { status } from '@shared/application/types/web_server';

export interface HttpResponse<T> {
  status: status;
  message: string;
  data?: T;
}
