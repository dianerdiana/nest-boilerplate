import { PrismaClient } from '../../generated/prisma/client';

export async function seedPermissions(prisma: PrismaClient) {
  await prisma.permission.createMany({
    // prettier-ignore
    data: [
      { id: 1, name: 'Manage:All', action: 'manage', subject: 'all' },
        
      { id: 2, name: 'Create:User', action: 'create', subject: 'User', conditions: '{"client_id":"$current_client_id"}' },
      { id: 3, name: 'Read:User', action: 'read', subject: 'User', conditions: '{"client_id":"$current_client_id"}' },
      { id: 4, name: 'Update:User', action: 'update', subject: 'User', conditions: '{"client_id":"$current_client_id"}' },
      { id: 5, name: 'Delete:User', action: 'delete', subject: 'User', conditions: '{"client_id":"$current_client_id"}' },
    ],

    skipDuplicates: true,
  });
}
