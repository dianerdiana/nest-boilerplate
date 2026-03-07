import { Injectable } from '@nestjs/common';
import { Permission, Role } from 'generated/prisma/client';

import { UserData } from '@/common/types/user-data.type';

type User = {
  id: number;
  email?: string | null;
  username: string;
  firstName: string;
  lastName?: string;
};

type UserPayload = {
  user: User;
  role: Role;
  permissions: Permission[];
};

@Injectable()
export class AuthProjectionService {
  buildUserData(payload: UserPayload): {
    id: number;
    username: string;
    email?: string | null;
    fullName: string;
    role: string;
    permissions: { action: string; subject: string }[];
  } {
    const permissions = payload.permissions.flatMap((permission) => ({
      action: permission.action,
      subject: permission.subject,
    }));

    const { user } = payload;

    return {
      id: user.id,
      fullName: user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName,
      email: user.email,
      username: user.username,
      role: payload.role.name,
      permissions,
    };
  }

  buildJwtPayload(user: User): UserData {
    return {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
