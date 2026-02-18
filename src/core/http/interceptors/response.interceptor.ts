

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

type ApiSuccessBody<T = unknown> = {
  data: T;
  meta?: unknown;
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp?.().getRequest?.();
    const method = request?.method;

    return next.handle().pipe(
      map((body) => {
        if (method === 'DELETE') {
          if (body && typeof body === 'object' && 'data' in body) {
            const dataValue = (body as ApiSuccessBody).data as { deleted?: boolean } | null | undefined;
            if (dataValue && typeof dataValue === 'object' && dataValue.deleted === true) {
              return body;
            }
          }

          return { data: { deleted: true } } satisfies ApiSuccessBody;
        }

        if (body && typeof body === 'object' && 'data' in body) {
          return body;
        }

        return { data: body ?? null } satisfies ApiSuccessBody;
      }),
    );
  }
}