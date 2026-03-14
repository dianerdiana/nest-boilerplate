import { SetMetadata } from '@nestjs/common';

import { CHECK_POLICIES_KEY } from '@/common/constants/access-control.constant';

import { AppAbility } from '../factories/casl-ability.factory';

export type PolicyHandler = (ability: AppAbility) => boolean;

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
