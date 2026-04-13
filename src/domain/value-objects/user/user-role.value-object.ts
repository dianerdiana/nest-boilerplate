export enum UserRoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  CLIENT_STAFF = 'CLIENT_STAFF',
}

export class UserRole {
  private readonly _value: UserRoleEnum;

  constructor(value: UserRoleEnum) {
    this._value = value;
    this.validate();
  }

  private validate(): void {
    if (!Object.values(UserRoleEnum).includes(this._value)) {
      throw new Error(`INVALID user role: ${this._value}`);
    }
  }

  get value(): UserRoleEnum {
    return this._value;
  }

  isSuperAdmin(): boolean {
    return this._value === UserRoleEnum.SUPER_ADMIN;
  }

  isAdmin(): boolean {
    return this._value === UserRoleEnum.ADMIN;
  }

  isClientAdmin(): boolean {
    return this._value === UserRoleEnum.CLIENT_ADMIN;
  }

  isClientStaff(): boolean {
    return this._value === UserRoleEnum.CLIENT_STAFF;
  }

  equals(other: UserRole): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: UserRoleEnum): UserRole {
    return new UserRole(value);
  }

  static createSuperAdmin(): UserRole {
    return new UserRole(UserRoleEnum.SUPER_ADMIN);
  }

  static createAdmin(): UserRole {
    return new UserRole(UserRoleEnum.ADMIN);
  }

  static createClientAdmin(): UserRole {
    return new UserRole(UserRoleEnum.CLIENT_ADMIN);
  }

  static createClientStaff(): UserRole {
    return new UserRole(UserRoleEnum.CLIENT_ADMIN);
  }
}
