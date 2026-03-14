import { Request } from 'express';

import { UserData } from '@/common/types/user-data.type';

import { AppAbility } from '../factories/casl-ability.factory';

export interface RequestWithUser extends Request {
  user: UserData;
  ability?: AppAbility;
}
