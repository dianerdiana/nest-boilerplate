import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/libs/prisma.service';

@Injectable()
export class UserRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserRoleByUserId(userId: number) {
    return this.prisma.userRole.findFirst({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }
}
