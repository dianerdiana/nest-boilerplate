import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import 'dotenv/config';
import { seedUsers } from './seeds/user.seed';
import { seedRoles } from './seeds/role.seed';
import { seedPermissions } from './seeds/permission.seed';
import { seedUserRoles } from './seeds/user-role.seed';
import { seedRolePermissions } from './seeds/role-permission.seed';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await seedRoles(prisma);
  await seedPermissions(prisma);
  await seedRolePermissions(prisma);
  await seedUsers(prisma);
  await seedUserRoles(prisma);
}

main()
  .then(async () => {
    console.log('Seed success');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
