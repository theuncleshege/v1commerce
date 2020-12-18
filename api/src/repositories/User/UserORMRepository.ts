import { getRepository } from 'typeorm';

import User from '@Entities/User';

import UserRepository from './UserRepository';

export default class UserORMRepository implements UserRepository {
  public async create(data: User) {
    const user = getRepository(User).create(data);

    return await getRepository(User).save(user);
  }

  public async findByUsername(username: string) {
    return await getRepository(User).findOneOrFail({
      where: { username },
    });
  }
}
