import { Module } from '@nestjs/common';
import { UserRoleRepository } from './infrastructure/repositories/user-role.repository';

@Module({
  providers: [UserRoleRepository],
  exports: [UserRoleRepository],
})
export class UserRoleModule {}
