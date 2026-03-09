import { PrismaService } from '@/common/libs/prisma.service';
import { Injectable } from '@nestjs/common';

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
