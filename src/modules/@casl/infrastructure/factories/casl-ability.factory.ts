import { Injectable, Logger } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility, MongoAbility, MongoQuery } from '@casl/ability';

import { Action, Subject } from '@/common/enums/access-control.enum';
import { Permission, User } from 'generated/prisma/client';

export type Subjects = Subject | 'all';
export type AppConditions = MongoQuery<Record<string, any>>;
export type AppAbility = MongoAbility<[Action, Subjects], AppConditions>;

@Injectable()
export class CaslAbilityFactory {
  private readonly logger = new Logger(CaslAbilityFactory.name);

  createForUser(user: User, permissions: Permission[], clientId: number): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    for (const permission of permissions) {
      if (!this.isValidAction(permission.action) || !this.isValidSubject(permission.subject)) {
        this.logger.warn(
          `Skipping invalid permission. action=${permission.action}, subject=${permission.subject}`,
        );
        continue;
      }

      const conditions = this.parseConditions(permission.conditions, user, clientId);

      if (permission.conditions && !conditions) {
        continue;
      }

      if (permission.inverted) {
        cannot(permission.action, permission.subject, conditions);
      } else {
        can(permission.action, permission.subject, conditions);
      }
    }

    return build();
  }

  private parseConditions(
    raw: string | null | undefined,
    user: User,
    clientId: number,
  ): AppConditions | undefined {
    if (!raw?.trim()) return undefined;

    try {
      const populated = raw
        .replace(/\$current_user_id/g, user.id.toString())
        .replace(/\$current_client_id/g, clientId.toString());

      return JSON.parse(populated) as AppConditions;
    } catch {
      this.logger.error(`Invalid JSON conditions for user ${user.id}: ${raw}`);
      return { _unreachable_: { $eq: true } };
    }
  }

  private isValidAction(action: string): action is Action {
    return Object.values(Action).includes(action as Action);
  }

  private isValidSubject(subject: string): subject is Subject {
    return Object.values(Subject).includes(subject as Subject);
  }
}
