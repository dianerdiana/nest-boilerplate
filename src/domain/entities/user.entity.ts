export interface UserProps {
  id: number;
  firstName: string;
  lastName?: string;
  userName: string;
  email: string;
  password: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id();
}
