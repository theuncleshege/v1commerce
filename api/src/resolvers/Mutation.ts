import {
  PRODUCT_ADDED,
  PRODUCT_REMOVED,
  PRODUCT_UPDATED,
  pubsub,
} from './Subscription';
import UserORMRepository from '@Repositories/User/UserORMRepository';
import ProductORMRepository from '@Repositories/Product/ProductORMRepository';
import ProductService from '@Services/ProductService/ProductService';
import UserService from '@Services/UserService/UserService';
import { GenericObject, HttpContextObject, Product, User } from '~/types';

const productService = new ProductService(new ProductORMRepository());
const userService = new UserService(new UserORMRepository());

const signup = async (_: GenericObject, args: User) => {
  const data = {
    name: args.name,
    username: args.username,
    password: args.password,
    admin: args.username === 'admin',
  };

  try {
    const { token, user } = await userService.createUser(data);

    return { token, user };
  } catch (error) {
    throw new Error('Username already exists!');
  }
};

const login = async (_: GenericObject, args: Partial<User>) => {
  if (!args.username || !args.password) {
    throw new Error('Username and Password cannot be empty!');
  }

  const { token, user } = await userService.login(args.username, args.password);

  return {
    token,
    user,
  };
};

const createProduct = async (
  _: GenericObject,
  args: Product,
  context: HttpContextObject
) => {
  UserService.getUserId(context);

  const data = {
    name: args.name,
    brand: args.brand,
    price: args.price,
    image: args.image,
    summary: args.summary,
  };

  try {
    const product = await productService.create(data);

    pubsub.publish(PRODUCT_ADDED, { productChanged: product });

    return product;
  } catch (e) {
    throw new Error('Product already exists!');
  }
};

const updateProduct = async (
  _: GenericObject,
  data: Product,
  context: HttpContextObject
) => {
  UserService.getUserId(context);

  try {
    const product = await productService.update(data.id as string, data);

    pubsub.publish(PRODUCT_UPDATED, { productChanged: product });

    return product;
  } catch (error) {
    throw new error();
  }
};

const deleteProduct = async (
  _: GenericObject,
  args: Product,
  context: HttpContextObject
) => {
  UserService.getUserId(context);

  try {
    const product = await productService.getById(args.id);
    await productService.delete(product.id as string);

    pubsub.publish(PRODUCT_REMOVED, { productChanged: product });
  } catch (error) {
    throw new error();
  }
};

const Mutation = {
  signup,
  login,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default Mutation;
