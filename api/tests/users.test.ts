import { makeExecutableSchema } from "graphql-tools";
import { graphql, ExecutionResult } from "graphql";

import typeDefs from "../src/schema";
import Query from "../src/resolvers/Query";
import Mutation from "../src/resolvers/Mutation";

import { LOGIN_QUERY, SIGNUP_QUERY } from "./queries"
import { users, populateUsers } from "./seed";

beforeEach(populateUsers);

const resolvers = { Query, Mutation }
const schema = makeExecutableSchema({ typeDefs, resolvers });
const rootValue = {};
const context = {};

describe("Users", () => {
  it("should log administrator in", async () => {
    const { username, password } = users[0];
    const variables = { username, password };

    const result: ExecutionResult = await graphql(schema, LOGIN_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.login.token).toBeTruthy();
    expect(data.login.user).toMatchObject({ "username": users[0].username, "admin": true});
  });

  it("should log user in", async () => {
    const { username, password } = users[1];
    const variables = { username, password };

    const result: ExecutionResult = await graphql(schema, LOGIN_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.login.token).toBeTruthy();
    expect(data.login.user).toMatchObject({ "username": users[1].username, "admin": false });
  });

  it("should reject invalid username", async () => {
    const rootValue = {};
    const context = {};
    const { password } = users[1];
    const variables = { username: "nouser", password };

    const result: ExecutionResult = await graphql(schema, LOGIN_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });

  it("should reject invalid password", async () => {
    const rootValue = {};
    const context = {};
    const { username } = users[1];
    const variables = { username, password: "wrongpassword" };

    const result: ExecutionResult = await graphql(schema, LOGIN_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });

  it("should create a new user", async () => {
    const rootValue = {};
    const context = {};
    const { password, name } = users[1];
    const variables = { username: "newuser", password, name };

    const result: ExecutionResult = await graphql(schema, SIGNUP_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.signup.token).toBeTruthy();
    expect(data.signup.user).toMatchObject({ "username": "newuser", "admin": false });
  });

  it("should not create an already existing user", async () => {
    const rootValue = {};
    const context = {};
    const { username, password, name } = users[1];
    const variables = { username, password, name };

    const result: ExecutionResult = await graphql(schema, SIGNUP_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });

  it("should not create a new user with incomplete data", async () => {
    const rootValue = {};
    const context = {};
    const { password } = users[1];
    const variables = { username: "newuser", password };

    const result: ExecutionResult = await graphql(schema, SIGNUP_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });
});
