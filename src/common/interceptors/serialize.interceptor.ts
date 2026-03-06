import { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
