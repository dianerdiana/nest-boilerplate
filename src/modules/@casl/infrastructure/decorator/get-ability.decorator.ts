import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../types/request-with-user.type';

export const GetAbillity = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.ability;
});
