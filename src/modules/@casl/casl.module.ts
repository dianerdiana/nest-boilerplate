import { Global, Module } from '@nestjs/common';

import { CaslAbilityFactory } from './infrastructure/factories/casl-ability.factory';
import { PoliciesGuard } from './infrastructure/guards/policies.guard';
import { UserRepository } from './infrastructure/repositories/user.repository';

import { BuildAbilityService } from './application/services/build-ability.service';

@Global()
@Module({
  providers: [CaslAbilityFactory, BuildAbilityService, PoliciesGuard, UserRepository],
  exports: [BuildAbilityService, PoliciesGuard],
})
export class CaslModule {}
