import { Injectable, Logger } from '@nestjs/common';

import {
  AbilityBuilder,
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';

import { Permission } from '@/generated/prisma/client';

import { Action, ACTIONS, Resource, RESOURCES } from '@/common/types/access-control.type';
import { UserData } from '@/common/types/user-data.type';

export type AppSubject = Resource | ForcedSubject<Exclude<Resource, 'all'>>;

export type AppConditions = MongoQuery<Record<string, any>>;
export type AppAbility = MongoAbility<[Action, AppSubject], AppConditions>;

@Injectable()
export class CaslAbilityFactory {
  private readonly logger = new Logger(CaslAbilityFactory.name);

  createForUser(user: UserData, permissions: Permission[], clientId: number): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    for (const permission of permissions) {
      if (!this.isValidAction(permission.action) || !this.isValidResource(permission.subject)) {
        this.logger.warn(
          `Skipping invalid permission. action=${permission.action}, subject=${permission.subject}`,
        );
        continue;
      }

      const conditions = this.parseConditions(permission.conditions, user, clientId);

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
    user: UserData,
    clientId: number,
  ): AppConditions | undefined {
    if (!raw?.trim()) return undefined;

    try {
      const populated = raw
        .replace(/\$current_user_id/g, user.sub.toString())
        .replace(/\$current_client_id/g, clientId.toString());

      return JSON.parse(populated) as AppConditions;
    } catch {
      this.logger.error(`Invalid JSON conditions for user ${user.sub}: ${raw}`);
      return { _unreachable_: { $eq: true } };
    }
  }

  private isValidAction(action: string): action is Action {
    return ACTIONS.includes(action as Action);
  }

  private isValidResource(resource: string): resource is Resource {
    return RESOURCES.includes(resource as Resource);
  }
}
