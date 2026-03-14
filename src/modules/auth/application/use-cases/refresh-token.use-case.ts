import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserData } from '@/common/types/user-data.type';

import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';

import { AuthProjectionService } from '../../infrastructure/services/auth-projection.service';
import { TokenGeneratorService } from '../../infrastructure/services/token-generator.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly authProjectionService: AuthProjectionService,
  ) {}

  async execute(userData: UserData) {
    const user = await this.userRepo.findOne({ username: userData.username });
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const jwtPayload = this.authProjectionService.buildJwtPayload(user);
    const accessToken = await this.tokenGeneratorService.generateAccessToken(jwtPayload);

    return accessToken;
  }
}
