import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { AuthProjectionService } from './infrastructure/services/auth-projection.service';
import { PasswordService } from './infrastructure/services/password.service';
import { TokenGeneratorService } from './infrastructure/services/token-generator.service';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserRoleRepository } from './infrastructure/repositories/user-role.repository';
import { RolePermissionRepository } from './infrastructure/repositories/role-permission.repository';
import { RoleRepository } from './infrastructure/repositories/role.respository';

import { AuthenticationController } from './interface/controllers/auth.controller';

import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';

@Module({
  imports: [PassportModule],
  controllers: [AuthenticationController],
  providers: [
    AuthProjectionService,
    PasswordService,
    TokenGeneratorService,

    UserRepository,
    UserRoleRepository,
    RolePermissionRepository,
    RoleRepository,

    JwtStrategy,
    JwtRefreshStrategy,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
  ],
})
export class AuthenticationModule {}
