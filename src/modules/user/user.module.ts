import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserQueryService } from './application/services/user-query.service';

@Module({
  providers: [UserRepository, UserQueryService],
  exports: [UserQueryService],
})
export class UserModule {}
