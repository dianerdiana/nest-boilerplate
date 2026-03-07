import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser>(err: unknown, user: TUser | false | null): TUser {
    if (err || !user) {
      throw err instanceof Error ? err : new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}
