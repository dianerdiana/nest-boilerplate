import { PrismaService } from '@/common/libs/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserRole(userId: bigint) {
    return this.prisma.userRole.findFirst({
      where: { userId },
      include: {
        role: true,
      },
    });
  }
}
