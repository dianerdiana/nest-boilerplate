import { User } from '../entities';

export interface UserRepository {
  save(payload: User): Promise<User>;
}
