import { PrismaService } from '@/common/libs/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne({ id, username, email }: { id?: number; username?: string; email?: string }) {
    if (!id && !username && !email) return null;

    return this.prisma.user.findFirst({
      where: {
        OR: [{ id }, { username }, { email }],
      },
    });
  }

  findUserAbility(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
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
        },
      },
    });
  }
}
