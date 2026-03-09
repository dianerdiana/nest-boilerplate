import { PrismaService } from '@/common/libs/prisma.service';
import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../../application/dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    const { roleId, ...restDto } = dto;

    return this.prisma.user.create({
      data: { ...restDto, userRoles: { create: [{ roleId: roleId }] } },
    });
  }

  findOne({ id, username, email }: { id?: number; username?: string; email?: string }) {
    if (!id && !username && !email) return null;

    return this.prisma.user.findFirst({
      where: {
        OR: [{ id }, { username }, { email }],
      },
    });
  }
}
