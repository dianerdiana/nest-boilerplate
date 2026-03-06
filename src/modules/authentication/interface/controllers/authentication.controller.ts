import { Controller, Post } from '@nestjs/common';

import { LoginSchema } from '../../application/schemas/login.schema';
import { RegisterSchema } from '../../application/schemas/register.schema';
import type { LoginDto } from '../../application/dtos/login.dto';
import type { RegisterDto } from '../../application/dtos/register.dto';

import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { ZodBody } from '@/common/decorators/zod.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  async login(@ZodBody(LoginSchema) body: LoginDto) {
    const { userData, accessToken, refreshToken } = await this.loginUseCase.execute(body);

    return { userData, accessToken, refreshToken };
  }

  @Post('register')
  async register(@ZodBody(RegisterSchema) body: RegisterDto) {
    const user = await this.registerUseCase.execute(body);

    return user;
  }
}
