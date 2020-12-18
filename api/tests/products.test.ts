import jwt from 'jsonwebtoken';
import { ExecutionResult, graphql, parse, subscribe } from 'graphql';
import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from '~/schema';
import Mutation from '~/resolvers/Mutation';
import Query from '~/resolvers/Query';
import Subscription from '~/resolvers/Subscription';

import { filterParams, Product } from '~/types';
import { APP_SECRET } from '~/utils';

import { populateProducts, products, users } from '@Helpers/seed';

import '@Tests/helpers/dbConnection';
import {
  CREATE_PRODUCT_QUERY,
  DELETE_PRODUCT_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_FILTER_QUERY,
  PRODUCTS_QUERY,
  SUBSCRIPTION_QUERY,
  UPDATE_PRODUCT_QUERY,
} from '@Tests/helpers/queries';

beforeEach(async () => {
  await populateProducts();
});

const resolvers = { Query, Mutation, Subscription };
const schema = makeExecutableSchema({ typeDefs, resolvers });
const rootValue = {};

const token = jwt.sign({ userId: users[0].id }, APP_SECRET);
const context = {
  request: {
    headers: {
      authorization: `Bearer ${token}`,
    },
  },
};

const fetchProducts = async (params: filterParams) => {
  const result: ExecutionResult = await graphql(
    schema,
    PRODUCTS_QUERY,
    rootValue,
    context,
    params
  );

  return result.data as { products: Product[] };
};

describe('Products', () => {
  it('should return a list of products', async () => {
    const result: ExecutionResult = await graphql(
      schema,
      PRODUCTS_QUERY,
      rootValue,
      context
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(2);
  });

  it('should return a filtered list of products', async () => {
    const params = { filter: 'Samsung' };
    const result: ExecutionResult = await graphql(
      schema,
      PRODUCTS_FILTER_QUERY,
      rootValue,
      context,
      params
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(1);
  });

  it('should return a list of products ordered by name_ASC', async () => {
    const params = { orderBy: 'name_ASC' };
    const data = await fetchProducts(params);

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(2);
    expect(data.products[0].name).toBe(products[1].name);
  });

  it('should return a list of products ordered by name_DESC', async () => {
    const params = { orderBy: 'name_DESC' };
    const data = await fetchProducts(params);

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(2);
    expect(data.products[0].name).toBe(products[0].name);
  });

  it('should return a list of products ordered by createdAt_ASC', async () => {
    const params = { orderBy: 'createdAt_ASC' };
    const data = await fetchProducts(params);

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(2);
    expect(data.products[0].name).toBe(products[1].name);
  });

  it('should return a subset of the list of products', async () => {
    const params = { skip: 1, count: 1 };
    const data = await fetchProducts(params);

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(1);
    expect(data.products[0].name).toBe(products[0].name);
  });

  it('should return a specified number of the products', async () => {
    const params = { count: 1, skip: 0 };
    const data = await fetchProducts(params);

    expect(data.products).toBeTruthy();
    expect(data.products.length).toBe(1);
    expect(data.products[0].name).toBe(products[1].name);
  });

  it('should return details of a single product', async () => {
    const { id } = products[0];
    const params = { id };

    const result: ExecutionResult = await graphql(
      schema,
      PRODUCT_QUERY,
      rootValue,
      context,
      params
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.product).toBeTruthy();
    expect(data.product.name).toBe(products[0].name);
  });

  it('should not return details of an invalid product', async () => {
    const params = { id: 'not-valid-product' };

    const result: ExecutionResult = await graphql(
      schema,
      PRODUCT_QUERY,
      rootValue,
      context,
      params
    );

    expect(result.errors).toBeTruthy();
  });

  it('should add a new product', async () => {
    const params = {
      name: 'Samsung Galaxy J8',
      brand: 'Samsung',
      price: 100,
      image: 'http://imgurl.com/jpeg.png',
      summary: 'Samsung Galaxy J8 Summary',
    };

    const result: ExecutionResult = await graphql(
      schema,
      CREATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.createProduct).toBeTruthy();
    expect(data.createProduct).toMatchObject(params);
  });

  it('should not add an already existing product', async () => {
    const { name } = products[1];
    const params = {
      name,
      brand: 'Apple',
      price: 100,
      image: 'http://imgurl.com/jpeg.png',
      summary: 'Apple iPhone X Summary',
    };

    const result: ExecutionResult = await graphql(
      schema,
      CREATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );

    expect(result.errors).toBeTruthy();
  });

  it('should not add a new product with incomplete data', async () => {
    const { name, brand, price } = products[1];
    const params = { name, brand, price };

    const result: ExecutionResult = await graphql(
      schema,
      CREATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );

    expect(result.errors).toBeTruthy();
  });

  it('should update an existing product', async () => {
    const { id, name, brand, price, image, summary } = products[1];
    const params = { id, name, brand, price, image, summary: 'New Summary' };

    const result: ExecutionResult = await graphql(
      schema,
      UPDATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.updateProduct).toBeTruthy();
    expect(data.updateProduct).toMatchObject({ id, name, brand, price });
    expect(data.updateProduct).not.toMatchObject({
      id,
      name,
      brand,
      price,
      summary,
    });
  });

  it('should update an existing product and change the product name', async () => {
    const { id, name, brand, price, image, summary } = products[1];
    const params = {
      id,
      name: 'iPhone XS',
      brand,
      price,
      image,
      summary: 'iPhone XS Summary',
    };

    const result: ExecutionResult = await graphql(
      schema,
      UPDATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(data.updateProduct).toBeTruthy();
    expect(data.updateProduct).toMatchObject({ id, brand, price });
    expect(data.updateProduct).not.toMatchObject({
      id,
      name,
      brand,
      price,
      image,
      summary,
    });
  });

  it('should not update an invalid product', async () => {
    const { name, brand, price, image } = products[1];
    const params = {
      id: '123',
      name,
      brand,
      price,
      image,
      summary: 'New Summary',
    };

    const result: ExecutionResult = await graphql(
      schema,
      UPDATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );

    expect(result.errors).toBeTruthy();
  });

  it('should not update a product to the name of another product', async () => {
    const { id, brand, price, image, summary } = products[1];
    const params = {
      id,
      name: products[0].name,
      brand,
      price,
      image,
      summary,
    };

    const result: ExecutionResult = await graphql(
      schema,
      UPDATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );

    expect(result.errors).toBeTruthy();
  });

  it('should delete a product', async () => {
    const { id } = products[1];
    const params = { id };

    const result: ExecutionResult = await graphql(
      schema,
      DELETE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );
    const data = <ExecutionResultDataDefault>result.data;

    expect(result.errors).toBeFalsy();
    expect(data.deleteProduct).toBeFalsy();
  });

  it('should not delete an invalid product', async () => {
    const params = { id: '123' };

    const result: ExecutionResult = await graphql(
      schema,
      DELETE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );

    expect(result.errors).toBeTruthy();
  });

  it('should trigger subscription when product is added', async () => {
    const params = {
      name: 'Samsung Galaxy J10',
      brand: 'Samsung',
      price: 100,
      image: 'http://imgurl.com/jpeg.png',
      summary: 'Samsung Galaxy J8 Summary',
    };

    const triggerSubscription = graphql(
      schema,
      CREATE_PRODUCT_QUERY,
      rootValue,
      context,
      params
    );
    const result = <AsyncIterableIterator<ExecutionResult>>(
      await subscribe(
        schema,
        parse(SUBSCRIPTION_QUERY),
        triggerSubscription,
        context
      )
    );
    const data = (await result.next()).value.data;

    expect(data.productChanged.name).toEqual('Samsung Galaxy J10');
  });
});
