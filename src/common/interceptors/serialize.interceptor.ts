import { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: Type<T>) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return new this.dto(data);
      }),
    );
  }
}
