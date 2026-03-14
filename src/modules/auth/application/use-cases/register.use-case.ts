import { BadRequestException, Injectable } from '@nestjs/common';

import { RoleRepository } from '@/modules/role/infrastructure/repositories/role.repository';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';

import { PasswordService } from '../../infrastructure/services/password.service';

import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,

    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: RegisterDto) {
    await this.validateEmail(dto.email);
    await this.validateUsername(dto.username);
    await this.validateRole(dto.roleId);

    const hashPassword = await this.passwordService.hashPassword(dto.password);

    return await this.userRepo.create({ ...dto, password: hashPassword });
  }

  async validateEmail(email?: string): Promise<void> {
    if (email) {
      const user = await this.userRepo.findOne({ email });
      if (user) throw new BadRequestException('Email is already exist');
    }
  }

  async validateUsername(username: string): Promise<void> {
    if (username) {
      const user = await this.userRepo.findOne({ username });
      if (user) throw new BadRequestException('Username is already exist');
    }
  }

  async validateRole(roleId: number): Promise<void> {
    if (roleId) {
      const role = await this.roleRepo.findUnique(roleId);
      if (!role) throw new BadRequestException();
    }
  }
}
