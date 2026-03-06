import { PrismaService } from '@/common/libs/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByRoleId(roleId: bigint) {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
    });
  }
}
