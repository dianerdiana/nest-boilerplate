import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import type { UserData } from '@/common/types/user-data.type';

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): UserData => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user as UserData;
});
