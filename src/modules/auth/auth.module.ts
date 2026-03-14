import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { UserRoleModule } from '../user-role/user-role.module';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { AuthProjectionService } from './infrastructure/services/auth-projection.service';
import { PasswordService } from './infrastructure/services/password.service';
import { TokenGeneratorService } from './infrastructure/services/token-generator.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { AuthenticationController } from './interface/controllers/auth.controller';

@Module({
  imports: [PassportModule, UserModule, UserRoleModule, RoleModule],
  controllers: [AuthenticationController],
  providers: [
    AuthProjectionService,
    PasswordService,
    TokenGeneratorService,

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
export class AuthModule {}
