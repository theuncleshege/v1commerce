import ProductEntity from '@Entities/Product';
import UserEntity from '@Entities/User';

export type Product =
  | {
      id?: string;
      name: string;
      slug?: string;
      brand: string;
      price: number;
      image: string;
      summary: string;
      createdAt?: number;
      updatedAt?: number;
    }
  | ProductEntity;

export type User =
  | {
      id?: string;
      name: string;
      username: string;
      password: string;
      admin?: boolean;
      createdAt?: number;
      updatedAt?: number;
    }
  | UserEntity;

export type AuthenticatedUser = {
  user: User;
  token: string;
};

export type filterParams = {
  filter?: string;
  orderBy?: string;
  skip?: number;
  count?: number;
};

export type HttpContextObject = {
  request?: {
    headers?: {
      authorization?: string;
    };
  };
};

export type JWTVerifyResponse = {
  userId: string;
};

export type GenericObject = { [key: string]: string | number };
