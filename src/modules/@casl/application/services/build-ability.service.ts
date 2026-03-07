import { Injectable } from '@nestjs/common';

import {
  AppAbility,
  CaslAbilityFactory,
} from '../../infrastructure/factories/casl-ability.factory';

import { UserData } from '@/common/types/user-data.type';

import { UserQueryService } from '@/modules/user/application/services/user-query.service';

@Injectable()
export class BuildAbilityService {
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private userQueryService: UserQueryService,
  ) {}

  async execute(userData: UserData): Promise<AppAbility | null> {
    const user = await this.userQueryService.findUserAbility(userData.sub);

    if (!user) return null;

    const permissions = user.userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission),
    );
    const ability = this.caslAbilityFactory.createForUser(user, permissions, 1);

    return ability;
  }
}
