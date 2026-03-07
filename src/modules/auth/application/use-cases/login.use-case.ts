import { UnauthorizedException, Injectable } from '@nestjs/common';

import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserRoleRepository } from '../../infrastructure/repositories/user-role.repository';
import { RolePermissionRepository } from '../../infrastructure/repositories/role-permission.repository';

import { PasswordService } from '../../infrastructure/services/password.service';
import { AuthProjectionService } from '../../infrastructure/services/auth-projection.service';
import { TokenGeneratorService } from '../../infrastructure/services/token-generator.service';

import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,

    private readonly passwordService: PasswordService,
    private readonly authProjectionService: AuthProjectionService,
    private readonly tokenGeneratorService: TokenGeneratorService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepo.findOne({ username: dto.email, email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const isPasswordMatch = await this.passwordService.comparePassword(dto.password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid username or password');

    const userRole = await this.userRoleRepo.findUserRole(user.id);
    if (!userRole) throw new UnauthorizedException('Invalid username or password');

    const rolePermissions = await this.rolePermissionRepo.findAllByRoleId(userRole.roleId);
    if (!rolePermissions) throw new UnauthorizedException('Invalid username or password');

    const jwtPayload = this.authProjectionService.buildJwtPayload(user);
    const userData = this.authProjectionService.buildUserData({
      user,
      role: userRole.role,
      permissions: rolePermissions.map((role) => role.permission),
    });

    const accessToken = await this.tokenGeneratorService.generateAccessToken(jwtPayload);
    const refreshToken = await this.tokenGeneratorService.generateRefreshToken(jwtPayload);

    return { userData, accessToken, refreshToken };
  }
}
