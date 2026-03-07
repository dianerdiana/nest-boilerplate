import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class UserQueryService {
  constructor(private readonly userRepo: UserRepository) {}

  findUserAbility(userId: number) {
    return this.userRepo.findUserAbility(userId);
  }
}
