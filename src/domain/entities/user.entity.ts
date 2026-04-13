import {
  Email,
  FullName,
  Password,
  UserId,
  Username,
  UserStatus,
  UserStatusEnum,
} from '../value-objects';

export interface UserProps {
  id?: UserId;
  fullName: FullName;
  username: Username;
  email: Email;
  password: Password;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): number | undefined {
    return this.props.id?.value;
  }

  get fullName(): string {
    return this.props.fullName.value;
  }

  get username(): string {
    return this.props.username.value;
  }

  get password(): string {
    return this.props.password.value;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateFullName(value: FullName): void {
    this.props.fullName = value;
    this.props.updatedAt = new Date();
  }

  updateUsername(value: Username): void {
    this.props.username = value;
    this.props.updatedAt = new Date();
  }

  updateStatus(value: UserStatus): void {
    this.props.status = value;
    this.props.updatedAt = new Date();
  }

  equals(other: User): boolean {
    if (!this.props.id || !other.props.id) return false;
    return this.props.id.equals(other.props.id);
  }

  // Factory Method
  static create(props: {
    fullName: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
    status?: UserStatusEnum;
  }): User {
    const now = new Date();

    return new User({
      fullName: FullName.create(props.fullName),
      username: Username.create(props.username),
      email: Email.create(props.email),
      password: Password.create(props.password),
      status: UserStatus.create(props.status || UserStatusEnum.ACTIVE),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: number;
    fullName: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
    status?: UserStatusEnum;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: UserId.from(props.id),
      fullName: FullName.create(props.fullName),
      username: Username.create(props.username),
      email: Email.create(props.email),
      password: Password.create(props.password),
      status: UserStatus.create(props.status || UserStatusEnum.ACTIVE),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  // For persistence
  toPersistence(): {
    id?: number;
    fullName: string;
    username: string;
    email: string;
    password: string;
    status: UserStatusEnum;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      ...(this.props.id && { id: this.props.id.value }),
      fullName: this.props.fullName.value,
      username: this.props.username.value,
      email: this.props.email.value,
      password: this.props.password.value,
      status: this.props.status.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
