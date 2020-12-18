import { getRepository, OrderByCondition } from 'typeorm';

import Product from '@Entities/Product';

import ProductRepository from './ProductRepository';

export default class ProductORMRepository implements ProductRepository {
  async all(filter: string, orderBy: string, skip = 0, count = 0) {
    const order = ProductORMRepository.getOrderBy(orderBy);
    const builder = getRepository(Product).createQueryBuilder('product');

    if (filter) {
      builder
        .where('product.name LIKE :q', { q: `%${filter}%` })
        .orWhere('product.summary LIKE :q', { q: `%${filter}%` });
    }

    return await builder.orderBy(order).skip(skip).take(count).getMany();
  }

  private static getOrderBy(value: string) {
    let order: OrderByCondition = { createdAt: 'DESC' };

    switch (value) {
      case 'name_ASC':
        order = { name: 'ASC' };
        break;

      case 'name_DESC':
        order = { name: 'DESC' };
        break;

      case 'createdAt_ASC':
        order = { createdAt: 'DESC' };
        break;
    }

    return order;
  }

  async findById(id: string) {
    return await getRepository(Product).findOneOrFail(id);
  }

  async save(data: Product) {
    const product = getRepository(Product).create(data);

    await getRepository(Product).save(product);

    return product;
  }

  async update(id: string, data: Product) {
    const product = await this.findById(id);

    return await getRepository(Product).save(Object.assign(product, data));
  }

  async deleteById(id: string) {
    await getRepository(Product).delete(id);
  }
}
