import { Module } from '@nestjs/common';

import { AuthProjectionService } from './infrastructure/services/auth-projection.service';
import { PasswordService } from './infrastructure/services/password.service';
import { TokenGeneratorService } from './infrastructure/services/token-generator.service';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserRoleRepository } from './infrastructure/repositories/user-role.repository';
import { RolePermissionRepository } from './infrastructure/repositories/role-permission.repository';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';

@Module({
  providers: [
    AuthProjectionService,
    PasswordService,
    TokenGeneratorService,

    UserRepository,
    UserRoleRepository,
    RolePermissionRepository,

    LoginUseCase,
    RegisterUseCase,
  ],
})
export class AuthenticationModule {}
