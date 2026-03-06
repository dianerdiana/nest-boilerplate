import { PrismaClient } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        firstName: 'Dian',
        lastName: 'Erdiana',
        email: 'dianerdiana.de@gmail.com',
        username: 'dianerdiana',
        password: await bcrypt.hash('123456', 10),
      },
    ],

    skipDuplicates: true,
  });
}
