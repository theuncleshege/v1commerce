import { makeExecutableSchema } from "graphql-tools";
import { graphql, ExecutionResult } from "graphql";
import jwt from "jsonwebtoken";

import typeDefs from "../src/schema";
import Query from "../src/resolvers/Query";
import Mutation from "../src/resolvers/Mutation";

import { PRODUCTS_QUERY, PRODUCT_QUERY, CREATE_PRODUCT_QUERY, UPDATE_PRODUCT_QUERY, DELETE_PRODUCT_QUERY, PRODUCTS_FILTER_QUERY } from "./queries"
import { products, users, populateProducts } from "./seed";
import { APP_SECRET } from "../src/utils";

beforeEach(populateProducts);

const resolvers = { Query, Mutation }
const schema = makeExecutableSchema({ typeDefs, resolvers });
const rootValue = {};

const token = jwt.sign({ userId: users[0].id }, APP_SECRET);
const context = {
  "request": {
    "headers": {
      "authorization": `Bearer ${token}`
    }
  }
};

describe("Products", () => {
  it("should return a list of products", async () => {
    const result: ExecutionResult = await graphql(schema, PRODUCTS_QUERY, rootValue, context);
    const data: any = result.data;

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(2);
  });
  
  it("should return a filtered list of products", async () => {
    const variables = { filter: "Samsung" };
    const result: ExecutionResult = await graphql(schema, PRODUCTS_FILTER_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(1);
  });

  it("should return details of a single product", async () => {
    const { id } = products[0];
    const variables = { id };

    const result: ExecutionResult = await graphql(schema, PRODUCT_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.product).toBeTruthy();
    expect(data.product).toMatchObject(products[0]);
  });

  it("should add a new product", async () => {
    const variables = { name: "Samsung Galaxy J8", brand: "Samsung", price: 100, summary: "Samsung Galaxy J8 Summary" };

    const result: ExecutionResult = await graphql(schema, CREATE_PRODUCT_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.createProduct).toBeTruthy();
    expect(data.createProduct).toMatchObject(variables);
  });

  it("should not add an already existing product", async () => {
    const { name } = products[1];
    const variables = { name, brand: "Apple", price: 100, summary: "Apple iPhone X Summary" };

    const result: ExecutionResult = await graphql(schema, CREATE_PRODUCT_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });

  it("should not add a new product with incomplete data", async () => {
    const { name, brand, price } = products[1];
    const variables = { name, brand, price };

    const result: ExecutionResult = await graphql(schema, CREATE_PRODUCT_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });

  it("should update an existing product", async () => {
    const { id, name, brand, price, summary } = products[1];
    const variables = { id, name, brand, price, summary: "New Summary" };

    const result: ExecutionResult = await graphql(schema, UPDATE_PRODUCT_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.updateProduct).toBeTruthy();
    expect(data.updateProduct).toMatchObject({ id, name, brand, price });
    expect(data.updateProduct).not.toMatchObject({ id, name, brand, price, summary });
  });

  it("should update an existing product and change the product name", async () => {
    const { id, name, brand, price, summary } = products[1];
    const variables = { id, name: "iPhone XS", brand, price, summary: "iPhone XS Summary" };

    const result: ExecutionResult = await graphql(schema, UPDATE_PRODUCT_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(data.updateProduct).toBeTruthy();
    expect(data.updateProduct).toMatchObject({ id, brand, price });
    expect(data.updateProduct).not.toMatchObject({ id, name, brand, price, summary });
  });

  it("should not update an invalid product", async () => {
    const { name, brand, price, summary } = products[1];
    const variables = { id: "123", name, brand, price, summary: "New Summary" };

    const result: ExecutionResult = await graphql(schema, UPDATE_PRODUCT_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });

  it("should not update a product to the name of another product", async () => {
    const { id, brand, price, summary } = products[1];
    const variables = { id, name: products[0].name, brand, price, summary };

    const result: ExecutionResult = await graphql(schema, UPDATE_PRODUCT_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });

  it("should delete a product", async () => {
    const { id } = products[1];
    const variables = { id };

    const result: ExecutionResult = await graphql(schema, DELETE_PRODUCT_QUERY, rootValue, context, variables);
    const data: any = result.data;

    expect(result.errors).toBeFalsy();
    expect(data.deleteProduct).toBeFalsy();
  });

  it("should not delete an invalid product", async () => {
    const variables = { id: "123" };

    const result: ExecutionResult = await graphql(schema, DELETE_PRODUCT_QUERY, rootValue, context, variables);

    expect(result.errors).toBeTruthy();
  });
});
