import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CONFIGURATION } from '../constants/configuration.constant';

@Injectable()
export class TokenGeneratorService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateClientApiKey(jwtPayload: { clientId: number }): Promise<string> {
    return await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>(CONFIGURATION.jwtAccessToken),
    });
  }
}
