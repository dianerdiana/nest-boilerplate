import { PrismaClient } from '../../generated/prisma/client';

export async function seedUserRoles(prisma: PrismaClient) {
  await prisma.userRole.createMany({
    data: [{ userId: 1, roleId: 1 }],

    skipDuplicates: true,
  });
}
