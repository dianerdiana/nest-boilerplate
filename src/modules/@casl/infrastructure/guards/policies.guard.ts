import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { BuildAbilityService } from '@/modules/@casl/application/services/build-ability.service';
import { CHECK_POLICIES_KEY } from '@/common/constants/access-control.constant';

import { PolicyHandler } from '../decorator/check-policies.decorator';
import { RequestWithUser } from '../types/request-with-user.type';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly buildAbilityService: BuildAbilityService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies =
      this.reflector.getAllAndOverride<PolicyHandler[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const ability = await this.buildAbilityService.execute(request.user);

    if (!ability) {
      throw new ForbiddenException('Unable to build access rules');
    }

    request.ability = ability;

    const isAllowed = policies.every((policy) => {
      try {
        return policy(ability);
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      throw new ForbiddenException('Access denied by policy');
    }

    return true;
  }
}
