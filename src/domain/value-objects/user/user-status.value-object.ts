export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPEND = 'SUSPEND',
}

export class UserStatus {
  private readonly _value: UserStatusEnum;

  constructor(value: UserStatusEnum) {
    this._value = value;
    this.validate();
  }

  private validate(): void {
    if (!Object.values(UserStatusEnum).includes(this._value)) {
      throw new Error(`Invalid user status: ${this._value}`);
    }
  }

  get value(): UserStatusEnum {
    return this._value;
  }

  equals(other: UserStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: UserStatusEnum): UserStatus {
    return new UserStatus(value);
  }
}
