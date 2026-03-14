import { Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Response } from 'express';

import { CONFIGURATION } from '@/common/constants/configuration.constant';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Serialize } from '@/common/decorators/serialize.decorator';
import { ZodBody } from '@/common/decorators/zod.decorator';
import type { UserData } from '@/common/types/user-data.type';

import type { LoginDto } from '../../application/dtos/login.dto';
import type { RegisterDto } from '../../application/dtos/register.dto';
import { LoginSchema } from '../../application/schemas/login.schema';
import { RegisterSchema } from '../../application/schemas/register.schema';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';

import { JwtRefreshGuard } from '../../infrastructure/guards/jwt-refresh.guard';

import { UserDataResponse } from '../responses/user.response';

const REFRESH_TOKEN_KEY = 'refreshToken';
const MAX_AGE_COOKIE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,

    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(
    @ZodBody(LoginSchema) body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { userData, accessToken, refreshToken } = await this.loginUseCase.execute(body);
    const isProduction = this.configService.get<string>(CONFIGURATION.nodeEnv) === 'production';

    response.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: MAX_AGE_COOKIE, // 7 Days
      path: '/',
    });

    return { userData, accessToken, refreshToken };
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    const isProduction = this.configService.get<string>(CONFIGURATION.nodeEnv) === 'production';

    response.clearCookie(REFRESH_TOKEN_KEY, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    return { message: 'Logged out' };
  }

  @Serialize(UserDataResponse)
  @Public()
  @Post('register')
  async register(@ZodBody(RegisterSchema) body: RegisterDto) {
    const user = await this.registerUseCase.execute(body);

    return user;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refreshToken(@CurrentUser() user: UserData) {
    const accessToken = await this.refreshTokenUseCase.execute(user);

    return { accessToken };
  }
}
