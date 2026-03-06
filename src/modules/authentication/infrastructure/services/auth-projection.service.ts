import { Injectable } from '@nestjs/common';
import { Permission, Role } from 'generated/prisma/client';

import { UserData } from '@/common/types/user-data.type';

type User = { id: bigint; email?: string | null; username: string };

type UserPayload = {
  user: User;
  role: Role;
  permissions: Permission[];
};

@Injectable()
export class AuthProjectionService {
  buildUserData(payload: UserPayload): {
    id: bigint;
    username: string;
    email?: string | null;
    role: string;
    permissions: { action: string; subject: string }[];
  } {
    const permissions = payload.permissions.flatMap((permission) => ({
      action: permission.action,
      subject: permission.subject,
    }));

    return {
      id: payload.user.id,
      email: payload.user.email,
      username: payload.user.username,
      role: payload.role.name,
      permissions,
    };
  }

  buildJwtPayload(user: User): UserData {
    return {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
