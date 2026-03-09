import { Injectable } from '@nestjs/common';

import {
  AppAbility,
  CaslAbilityFactory,
} from '../../infrastructure/factories/casl-ability.factory';

import { UserData } from '@/common/types/user-data.type';

import { UserRoleRepository } from '@/modules/user-role/infrastructure/repositories/user-role.repository';

@Injectable()
export class BuildAbilityService {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly userRoleRepo: UserRoleRepository,
  ) {}

  async execute(userData: UserData): Promise<AppAbility | null> {
    const userRole = await this.userRoleRepo.findUserRoleByUserId(userData.sub);

    if (!userRole) return null;

    const permissions = userRole.role.rolePermissions.map((rp) => rp.permission);
    const ability = this.caslAbilityFactory.createForUser(userData, permissions, 1);

    return ability;
  }
}
