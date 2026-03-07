import { Injectable } from '@nestjs/common';

import {
  AppAbility,
  CaslAbilityFactory,
} from '../../infrastructure/factories/casl-ability.factory';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

import { UserData } from '@/common/types/user-data.type';

@Injectable()
export class BuildAbilityService {
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private userRepo: UserRepository,
  ) {}

  async execute(userData: UserData): Promise<AppAbility | null> {
    const user = await this.userRepo.findOneWithPermissions(userData.sub);

    if (!user) return null;

    const permissions = user.userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission),
    );
    const ability = this.caslAbilityFactory.createForUser(user, permissions, 1);

    return ability;
  }
}
