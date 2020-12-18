import jwt from 'jsonwebtoken';

import UserRepository from '@Repositories/User/UserRepository';
import { APP_SECRET, hashPassword, isValidUnencryptedValue } from '~/utils';
import {
  AuthenticatedUser,
  HttpContextObject,
  JWTVerifyResponse,
  User,
} from '~/types';

export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async createUser(userData: User): Promise<AuthenticatedUser> {
    userData = {
      ...userData,
      password: await hashPassword(userData.password),
    };

    const user = await this.userRepository.create(userData);
    const token = jwt.sign({ username: user.username }, APP_SECRET);

    return { user, token };
  }

  public async login(
    username: string,
    password: string
  ): Promise<AuthenticatedUser> {
    const user = await this.findByUsername(username);
    const isValidPassword = await isValidUnencryptedValue(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return { user, token };
  }

  public async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  public static getUserId(context: HttpContextObject) {
    if (context.request === undefined) {
      throw new Error('Undefined Request');
    }
    if (context.request.headers === undefined) {
      throw new Error('Undefined Headers');
    }

    const authorization = context.request.headers.authorization;
    if (authorization !== undefined) {
      const token = authorization.replace('Bearer ', '');
      const { userId } = <JWTVerifyResponse>jwt.verify(token, APP_SECRET);
      return userId;
    } else {
      throw new Error('Not authenticated');
    }
  }
}
