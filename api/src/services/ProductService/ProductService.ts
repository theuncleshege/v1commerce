import slug from 'slug';

import ProductRepository from '@Repositories/Product/ProductRepository';
import { Product } from '~/types';

slug.defaults.mode = 'rfc3986';

export default class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  public async create(data: Product) {
    data = { ...data, slug: slug(data.name) };
    return this.productRepository.save(data);
  }

  public async update(id: string, data: Product) {
    data = { ...data, slug: slug(data.name) };
    return this.productRepository.update(id, data);
  }

  public async getById(id?: string) {
    return this.productRepository.findById(id);
  }

  public async delete(id: string) {
    return this.productRepository.deleteById(id);
  }

  public async getAll(
    filter?: string,
    orderBy?: string,
    skip?: number,
    count?: number
  ) {
    return this.productRepository.all(filter, orderBy, skip, count);
  }
}
