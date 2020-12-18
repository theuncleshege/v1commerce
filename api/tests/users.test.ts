import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { ExecutionResult, graphql } from 'graphql';
import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from '~/schema';
import Mutation from '~/resolvers/Mutation';
import Query from '~/resolvers/Query';
import { APP_SECRET } from '~/utils';

import { deleteUser, populateUsers, users } from '@Helpers/seed';
import UserService from '@Services/UserService/UserService';

import '@Tests/helpers/dbConnection';
import { LOGIN_QUERY, SIGNUP_QUERY } from '@Tests/helpers/queries';

beforeEach(async () => {
  await populateUsers();
});

const resolvers = { Query, Mutation };
const schema = makeExecutableSchema({ typeDefs, resolvers });
const rootValue = {};
const context = {};

describe('Users', () => {
  it('should log administrator in', async () => {
    const { username, password } = users[0];
    const variables = { username, password };

    const result: ExecutionResult = await graphql(
      schema,
      LOGIN_QUERY,
      rootValue,
      context,
      variables
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.login.token).toBeTruthy();
    expect(data.login.user).toMatchObject({
      username: users[0].username,
      admin: true,
    });
  });

  it('should log user in', async () => {
    const { username, password } = users[1];
    const variables = { username, password };

    const result: ExecutionResult = await graphql(
      schema,
      LOGIN_QUERY,
      rootValue,
      context,
      variables
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.login.token).toBeTruthy();
    expect(data.login.user).toMatchObject({
      username: users[1].username,
      admin: false,
    });
  });

  it('should reject invalid username', async () => {
    const rootValue = {};
    const context = {};
    const { password } = users[1];
    const variables = { username: 'nouser', password };

    const result: ExecutionResult = await graphql(
      schema,
      LOGIN_QUERY,
      rootValue,
      context,
      variables
    );

    expect(result.errors).toBeTruthy();
  });

  it('should reject invalid password', async () => {
    const rootValue = {};
    const context = {};
    const { username } = users[1];
    const variables = { username, password: 'wrongpassword' };

    const result: ExecutionResult = await graphql(
      schema,
      LOGIN_QUERY,
      rootValue,
      context,
      variables
    );

    expect(result.errors).toBeTruthy();
  });

  it('should throw error for empty username or password', async () => {
    const rootValue = {};
    const context = {};
    const variables = { username: '', password: '' };

    const result: ExecutionResult = await graphql(
      schema,
      LOGIN_QUERY,
      rootValue,
      context,
      variables
    );

    expect(result.errors).toBeTruthy();
  });

  it('should create a new user', async () => {
    const rootValue = {};
    const context = {};
    const { password, name } = users[1];
    const variables = { username: 'newuser', password, name };

    const result: ExecutionResult = await graphql(
      schema,
      SIGNUP_QUERY,
      rootValue,
      context,
      variables
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.signup.token).toBeTruthy();
    expect(data.signup.user).toMatchObject({
      username: 'newuser',
      admin: false,
    });
  });

  it('should create a new admin user', async () => {
    const rootValue = {};
    const context = {};
    const { id, password, name } = users[0];

    await deleteUser(id);

    const variables = { username: 'admin', password, name };

    const result: ExecutionResult = await graphql(
      schema,
      SIGNUP_QUERY,
      rootValue,
      context,
      variables
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.signup.token).toBeTruthy();
    expect(data.signup.user).toMatchObject({ username: 'admin', admin: true });
  });

  it('should not create an already existing user', async () => {
    const rootValue = {};
    const context = {};
    const { username, password, name } = users[1];
    const variables = { username, password, name };

    const result: ExecutionResult = await graphql(
      schema,
      SIGNUP_QUERY,
      rootValue,
      context,
      variables
    );

    expect(result.errors).toBeTruthy();
  });

  it('should not create a new user with incomplete data', async () => {
    const rootValue = {};
    const context = {};
    const { password } = users[1];
    const variables = { username: 'newuser', password };

    const result: ExecutionResult = await graphql(
      schema,
      SIGNUP_QUERY,
      rootValue,
      context,
      variables
    );

    expect(result.errors).toBeTruthy();
  });

  describe('Token related tests', () => {
    it('should return correct userId from token', () => {
      const token = jwt.sign({ userId: users[0].id }, APP_SECRET);

      const userId = UserService.getUserId({
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });
      expect(userId).toBe(users[0].id);
    });

    it('should throw error for incorrect token requests', () => {
      expect(() => {
        UserService.getUserId({
          request: {
            headers: {
              authorization: 'Bearer djkfhsdkjfhdsj',
            },
          },
        });
      }).toThrowError(JsonWebTokenError);
    });

    it('should throw error for undefined requests', () => {
      expect(() => {
        UserService.getUserId({});
      }).toThrowError(/Undefined Request/);
    });

    it('should throw error for undefined headers', () => {
      expect(() => {
        UserService.getUserId({
          request: {},
        });
      }).toThrowError(/Undefined Headers/);
    });

    it('should throw error for undefined authorization', () => {
      expect(() => {
        UserService.getUserId({
          request: {
            headers: {},
          },
        });
      }).toThrowError(/Not authenticated/);
    });
  });
});
