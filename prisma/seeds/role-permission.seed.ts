import { PrismaClient } from '../../generated/prisma/client';

export async function seedRolePermissions(prisma: PrismaClient) {
  await prisma.rolePermission.createMany({
    data: [
      { roleId: 1, permissionId: 1 },

      { roleId: 2, permissionId: 2 },
      { roleId: 2, permissionId: 3 },
      { roleId: 2, permissionId: 4 },
      { roleId: 2, permissionId: 5 },
    ],

    skipDuplicates: true,
  });
}
