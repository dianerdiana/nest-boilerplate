import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpResponse, type PaginationMeta } from '../utils/http-response';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, HttpResponse<unknown>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<HttpResponse<unknown>> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (payload instanceof HttpResponse) return payload;

        if (isPlainObject(payload)) {
          const maybeMessage = typeof payload.message === 'string' ? payload.message : 'ok';
          const hasData = 'data' in payload;
          const hasMeta = 'meta' in payload;

          // Controller/service explicitly returns { data, meta?, message? }
          if (hasData || hasMeta) {
            return HttpResponse.success({
              message: maybeMessage,
              data: hasData ? payload.data : undefined,
              meta: hasMeta ? (payload.meta as PaginationMeta) : undefined,
            });
          }
        }

        // Plain payload => wrap as data
        return HttpResponse.success({
          message: 'ok',
          data: payload,
        });
      }),
    );
  }
}
