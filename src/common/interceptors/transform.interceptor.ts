import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpResponse } from '../utils/http-response';
import { ResponseMeta } from '../types/response-meta.type';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, HttpResponse<unknown>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<HttpResponse<unknown>> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (payload instanceof HttpResponse) {
          return payload;
        }

        if (payload === undefined || payload === null) {
          return HttpResponse.success();
        }

        if (isPlainObject(payload)) {
          const message = typeof payload.message === 'string' ? payload.message : 'ok';
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const hasData = Object.prototype.hasOwnProperty.call(payload, 'data');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const hasMeta = Object.prototype.hasOwnProperty.call(payload, 'meta');

          if (hasData || hasMeta) {
            return HttpResponse.success({
              message,
              data: hasData ? payload.data : undefined,
              meta: hasMeta ? (payload.meta as ResponseMeta) : undefined,
            });
          }
        }

        return HttpResponse.success({
          data: payload,
        });
      }),
    );
  }
}
