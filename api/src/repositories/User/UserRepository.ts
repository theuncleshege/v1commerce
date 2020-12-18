import { User } from '~/types';

export default interface UserRepository {
  create(userData: User): Promise<User>;
  findByUsername(username: string): Promise<User>;
}
