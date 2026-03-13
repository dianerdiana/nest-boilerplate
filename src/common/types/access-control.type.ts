export const ACTIONS = ['manage', 'create', 'read', 'update', 'delete'] as const;
export type Action = (typeof ACTIONS)[number];

export const RESOURCES = [
  'all',
  'Auth',
  'User',
  'Permission',
  'Role',
  'RolePermission',
  'UserRole',
] as const;
export type Resource = (typeof RESOURCES)[number];
