import ProductORMRepository from '@Repositories/Product/ProductORMRepository';
import ProductService from '@Services/ProductService/ProductService';
import { filterParams, GenericObject, Product } from '~/types';

const productService = new ProductService(new ProductORMRepository());

const Query = {
  products: async (_: GenericObject, args: filterParams) => {
    return await productService.getAll(
      args.filter,
      args.orderBy,
      args.skip,
      args.count
    );
  },
  product: async (_: GenericObject, args: Product) => {
    try {
      return await productService.getById(args.id);
    } catch (e) {
      throw new e();
    }
  },
};

export default Query;
