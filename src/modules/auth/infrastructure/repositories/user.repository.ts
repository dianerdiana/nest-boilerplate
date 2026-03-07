import { PrismaService } from '@/common/libs/prisma.service';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../../application/dtos/register.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne({ email, username }: { email?: string; username?: string }) {
    return this.prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        firstName: true,
        lastName: true,
      },
      where: { OR: [{ email }, { username }] },
    });
  }

  create(dto: RegisterDto) {
    const { roleId, ...restDto } = dto;

    return this.prisma.user.create({
      data: { ...restDto, userRoles: { create: [{ roleId: roleId }] } },
    });
  }
}
