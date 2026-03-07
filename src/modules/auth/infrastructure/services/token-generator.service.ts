import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CONFIGURATION } from '../../../../common/constants/configuration.constant';
import { UserData } from '../../../../common/types/user-data.type';

@Injectable()
export class TokenGeneratorService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(jwtPayload: UserData): Promise<string> {
    const secret = this.configService.getOrThrow<string>(CONFIGURATION.jwtAccessToken);
    const expiresIn = this.configService.getOrThrow<number>(CONFIGURATION.jwtAccessTokenExpire);

    return await this.jwtService.signAsync(jwtPayload, { secret, expiresIn });
  }

  async generateRefreshToken(jwtPayload: UserData): Promise<string> {
    const secret = this.configService.getOrThrow<string>(CONFIGURATION.jwtRefreshToken);
    const expiresIn = this.configService.getOrThrow<number>(CONFIGURATION.jwtRefreshTokenExpire);

    return await this.jwtService.signAsync(jwtPayload, { secret, expiresIn });
  }
}
