import typeorm = require('typeorm');
import { v4 as uuidv4 } from 'uuid';

import User from '@Entities/User';
import UserORMRepository from './UserORMRepository';

const user = {
  id: uuidv4(),
  name: 'Administrator',
  username: 'admin',
  password: '123456',
  admin: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('UserORMRepository Unit Tests', () => {
  let userORMRepository: UserORMRepository;

  beforeEach(() => {
    userORMRepository = new UserORMRepository();
  });

  it("should call the typeorm getRepository's user create and save methods", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      create: jest.fn().mockReturnValue(user),
      save: jest.fn().mockResolvedValue(user),
    });

    const result = await userORMRepository.create(user);

    expect(result).toEqual(user);

    expect(typeorm.getRepository).toHaveBeenNthCalledWith(1, User);
    expect(typeorm.getRepository(User).create).toHaveBeenNthCalledWith(1, user);
    expect(typeorm.getRepository(User).save).toHaveBeenNthCalledWith(1, user);
  });

  it("should call the typeorm getRepository's findOneOrFail method", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOneOrFail: jest.fn().mockResolvedValue(user),
    });

    const result = await userORMRepository.findByUsername(user.username);

    expect(result).toEqual(user);

    expect(typeorm.getRepository).toHaveBeenNthCalledWith(1, User);
    expect(typeorm.getRepository(User).findOneOrFail).toHaveBeenNthCalledWith(
      1,
      {
        where: {
          username: user.username,
        },
      }
    );
  });
});
