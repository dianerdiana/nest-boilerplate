import { PrismaClient } from '../../generated/prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  await prisma.role.createMany({
    data: [
      { id: 1, name: 'SUPER_ADMIN', description: 'Super Admin' },
      { id: 2, name: 'ADMIN', description: 'Admin' },
    ],

    skipDuplicates: true,
  });
}
