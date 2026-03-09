import { Module } from '@nestjs/common';

import { CaslAbilityFactory } from './infrastructure/factories/casl-ability.factory';
import { PoliciesGuard } from './infrastructure/guards/policies.guard';

import { BuildAbilityService } from './application/services/build-ability.service';

import { UserRoleModule } from '../user-role/user-role.module';

@Module({
  imports: [UserRoleModule],
  providers: [CaslAbilityFactory, BuildAbilityService, PoliciesGuard],
  exports: [BuildAbilityService, PoliciesGuard],
})
export class CaslModule {}
