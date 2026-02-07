import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { tap } from 'rxjs';

import { RequestContextService } from './AppRequestContext';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    /**
     * Setting an ID in the global context for each request.
     * This ID can be used as correlation id shown in logs
     */
    const requestId = request?.body?.requestId ?? nanoid(24);

    RequestContextService.setRequestId(requestId);

    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      }),
    );
  }
}
