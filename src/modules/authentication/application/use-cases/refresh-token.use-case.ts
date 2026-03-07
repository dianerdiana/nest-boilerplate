import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { TokenGeneratorService } from '../../infrastructure/services/token-generator.service';
import { AuthProjectionService } from '../../infrastructure/services/auth-projection.service';

import { UserData } from '@/common/types/user-data.type';

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
