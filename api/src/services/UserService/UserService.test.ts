import { mocked } from 'ts-jest/utils';
import jwt from 'jsonwebtoken';

import UserRepository from '@Repositories/User/UserORMRepository';
import UserService from './UserService';

import { hashPassword, isValidUnencryptedValue } from '~/utils';

jest.mock('jsonwebtoken');
jest.mock('@Repositories/User/UserORMRepository');
jest.mock('~/utils');

const mockedJwt = mocked(jwt, true);
const mockedUserRepository = mocked(UserRepository, true);

const user = {
  id: 'uuid',
  name: 'Administrator',
  username: 'admin',
  password: '123456',
  admin: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('User Service Unit Tests', () => {
  let userService: UserService;

  beforeEach(() => {
    mockedUserRepository.mockClear();
    mockedUserRepository.prototype.findByUsername.mockClear();

    userService = new UserService(new UserRepository());
  });

  it("should create new user by calling the repository's create method", async () => {
    const mockedHashPassword = mocked(hashPassword, true);
    const token = 'token';

    mockedHashPassword.mockResolvedValue(user.password);
    mockedJwt.sign.mockReturnValue((token as unknown) as void);

    const createMethod = mockedUserRepository.prototype.create;
    createMethod.mockResolvedValue(user);

    const result = await userService.createUser(user);
    expect(result).toEqual({ user, token });

    expect(createMethod).toHaveBeenNthCalledWith(1, user);
  });

  it('should login existing user', async () => {
    mockedUserRepository.prototype.findByUsername.mockResolvedValue(user);

    const mockedIsValidUnencryptedValue = mocked(isValidUnencryptedValue, true);
    const token = 'token';

    mockedIsValidUnencryptedValue.mockResolvedValue(true);
    mockedJwt.sign.mockReturnValue((token as unknown) as void);

    const result = await userService.login(user.username, user.password);
    expect(result).toEqual({ user, token });

    expect(isValidUnencryptedValue).toHaveBeenNthCalledWith(
      1,
      user.password,
      user.password
    );
  });

  it('should not login existing user with wrong password', async () => {
    mockedUserRepository.prototype.findByUsername.mockResolvedValue(user);

    const mockedIsValidUnencryptedValue = mocked(isValidUnencryptedValue, true);

    mockedIsValidUnencryptedValue.mockResolvedValue(false);

    await expect(
      userService.login(user.username, user.password)
    ).rejects.toThrowError('Invalid password');

    expect(isValidUnencryptedValue).toHaveBeenNthCalledWith(
      1,
      user.password,
      user.password
    );
  });

  it("should find user by calling the repository's findByUsername method", async () => {
    await userService.findByUsername(user.username);

    expect(
      mockedUserRepository.prototype.findByUsername
    ).toHaveBeenNthCalledWith(1, user.username);
  });

  it('should return correct userId from token', () => {
    const result = {
      userId: 1,
    };
    mockedJwt.verify.mockReturnValue((result as unknown) as void);
    expect(
      UserService.getUserId({
        request: {
          headers: {
            authorization: `Bearer dsfsdf`,
          },
        },
      })
    ).toBe(result.userId);
  });

  it('should throw error for unauthorized requests', () => {
    expect(() => {
      UserService.getUserId({});
    }).toThrowError('Undefined Request');

    expect(() => {
      UserService.getUserId({
        request: {},
      });
    }).toThrowError('Undefined Headers');

    expect(() => {
      UserService.getUserId({
        request: {
          headers: {},
        },
      });
    }).toThrowError('Not authenticated');
  });
});
