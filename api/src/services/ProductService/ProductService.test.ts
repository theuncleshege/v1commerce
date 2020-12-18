import slug from 'slug';
import { mocked } from 'ts-jest/utils';

import ProductRepository from '@Repositories/Product/ProductORMRepository';
import ProductService from './ProductService';

jest.mock('@Repositories/Product/ProductORMRepository');

const mockedProductRepository = mocked(ProductRepository, true);
slug.defaults.mode = 'rfc3986';

const product = {
  id: 'uuid',
  name: 'samsung galaxy s3',
  brand: 'samsung',
  image:
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  price: 100,
  summary: 'summary',
};

describe('Product Service Tests', () => {
  let productService: ProductService;

  beforeEach(() => {
    mockedProductRepository.mockClear();
    mockedProductRepository.prototype.save.mockClear();

    productService = new ProductService(new ProductRepository());
  });

  it("should create a product by calling the repository's save method", async () => {
    await productService.create(product);

    const saveMethod = mockedProductRepository.prototype.save;

    expect(saveMethod).toHaveBeenNthCalledWith(1, {
      ...product,
      slug: slug(product.name),
    });
  });

  it("should update a product by calling the repository's update method", async () => {
    await productService.update(product.id, product);

    const updateMethod = mockedProductRepository.prototype.update;

    expect(updateMethod).toHaveBeenNthCalledWith(1, product.id, {
      ...product,
      slug: slug(product.name),
    });
  });

  it("should find a product by calling the repository's findById method", async () => {
    await productService.getById(product.id);

    expect(mockedProductRepository.prototype.findById).toHaveBeenNthCalledWith(
      1,
      product.id
    );
  });

  it("should delete a product by calling the repository's deleteById method", async () => {
    await productService.delete(product.id);

    expect(
      mockedProductRepository.prototype.deleteById
    ).toHaveBeenNthCalledWith(1, product.id);
  });

  it("should return all products by calling the repository's all method", async () => {
    await productService.getAll();

    expect(mockedProductRepository.prototype.all).toHaveBeenCalledTimes(1);
  });
});
