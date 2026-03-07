import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserDataResponse {
  @Expose() id: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => `${obj.firstName}${obj.lastName ? ' ' + obj.lastName : ''}`)
  fullName: string;

  @Expose() email: string;
  @Expose() username: string;
  @Expose() role: string;
  @Expose() permissions: any[];

  constructor(partial: Partial<UserDataResponse>) {
    Object.assign(this, partial);
  }
}
