/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpResponse } from '../utils/http-response';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, HttpResponse<unknown>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<HttpResponse<unknown>> {
    return next.handle().pipe(
      map((payload: any) => {
        if (payload instanceof HttpResponse) return payload;

        let data: unknown = payload;

        if (isPlainObject(payload)) {
          if ('data' in payload && 'meta' in payload) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const rawData = (payload as any).data;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const meta = (payload as any).meta;
            if (isPlainObject(rawData)) data = { ...rawData, meta };
            else data = { value: rawData, meta };
          } else if ('meta' in payload) {
            const { meta, ...rest } = payload;
            data = { ...rest, meta };
          }
        }

        return HttpResponse.success(data, 'ok');
      }),
    );
  }
}
