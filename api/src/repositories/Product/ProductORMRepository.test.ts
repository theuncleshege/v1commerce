import typeorm = require('typeorm');
import { v4 as uuidv4 } from 'uuid';
import ProductORMRepository from './ProductORMRepository';
import Product from '@Entities/Product';

export const product = {
  id: uuidv4(),
  name: 'Samsung Galaxy J6',
  slug: 'samsung-galaxy-j6',
  brand: 'Samsung',
  price: 700,
  image:
    'https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  summary:
    'With a nice end to end display, the Samsung Galaxy J6 is impressive save for its low resolution. That being 1480 X 720 pixels on a 5.6-inch screen which is surprisingly quite colourful mostly because of the AMOLED screen.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ProductORMRepository Unit Tests', () => {
  let productORMRepository: ProductORMRepository;

  beforeEach(() => {
    productORMRepository = new ProductORMRepository();
  });

  it("should call typeorm's createQueryBuilder methods with filter", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([product]),
      }),
    });

    const filter = 'filter';
    const result = await productORMRepository.all(filter, '', 1, 1);

    expect(result).toEqual([product]);

    const queryBuilder = typeorm.getRepository(Product).createQueryBuilder;
    expect(queryBuilder).toHaveBeenNthCalledWith(1, 'product');
    expect(queryBuilder().where).toHaveBeenNthCalledWith(
      1,
      'product.name LIKE :q',
      { q: `%${filter}%` }
    );
    expect(queryBuilder().orWhere).toHaveBeenNthCalledWith(
      1,
      'product.summary LIKE :q',
      { q: `%${filter}%` }
    );
    expect(queryBuilder().orderBy).toHaveBeenNthCalledWith(1, {
      createdAt: 'DESC',
    });
    expect(queryBuilder().skip).toHaveBeenNthCalledWith(1, 1);
    expect(queryBuilder().take).toHaveBeenNthCalledWith(1, 1);
    expect(queryBuilder().getMany).toHaveBeenCalledTimes(1);
  });

  it("should call typeorm's createQueryBuilder methods with orderBy name ASC", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([product]),
      }),
    });

    const result = await productORMRepository.all('', 'name_ASC');

    expect(result).toEqual([product]);

    const queryBuilder = typeorm.getRepository(Product).createQueryBuilder;
    expect(queryBuilder).toHaveBeenNthCalledWith(1, 'product');
    expect(queryBuilder().orderBy).toHaveBeenNthCalledWith(1, { name: 'ASC' });
    expect(queryBuilder().skip).toHaveBeenNthCalledWith(1, 0);
    expect(queryBuilder().take).toHaveBeenNthCalledWith(1, 0);
    expect(queryBuilder().getMany).toHaveBeenCalledTimes(1);
  });

  it("should call typeorm's createQueryBuilder methods with orderBy name DESC", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([product]),
      }),
    });

    const result = await productORMRepository.all('', 'name_DESC');

    expect(result).toEqual([product]);

    const queryBuilder = typeorm.getRepository(Product).createQueryBuilder;
    expect(queryBuilder).toHaveBeenNthCalledWith(1, 'product');
    expect(queryBuilder().orderBy).toHaveBeenNthCalledWith(1, { name: 'DESC' });
    expect(queryBuilder().skip).toHaveBeenNthCalledWith(1, 0);
    expect(queryBuilder().take).toHaveBeenNthCalledWith(1, 0);
    expect(queryBuilder().getMany).toHaveBeenCalledTimes(1);
  });

  it("should call typeorm's createQueryBuilder methods with orderBy name DESC", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([product]),
      }),
    });

    const result = await productORMRepository.all('', 'createdAt_ASC');

    expect(result).toEqual([product]);

    const queryBuilder = typeorm.getRepository(Product).createQueryBuilder;
    expect(queryBuilder).toHaveBeenNthCalledWith(1, 'product');
    expect(queryBuilder().orderBy).toHaveBeenNthCalledWith(1, {
      createdAt: 'DESC',
    });
    expect(queryBuilder().skip).toHaveBeenNthCalledWith(1, 0);
    expect(queryBuilder().take).toHaveBeenNthCalledWith(1, 0);
    expect(queryBuilder().getMany).toHaveBeenCalledTimes(1);
  });

  it("should call typeorm getRepository's findById method on product find", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOneOrFail: jest.fn().mockResolvedValue(product),
    });

    const result = await productORMRepository.findById(product.id);

    expect(result).toEqual(product);

    expect(typeorm.getRepository).toHaveBeenNthCalledWith(1, Product);
    expect(
      typeorm.getRepository(Product).findOneOrFail
    ).toHaveBeenNthCalledWith(1, product.id);
  });

  it("should call typeorm getRepository's product create and save methods on product create", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      create: jest.fn().mockReturnValue(product),
      save: jest.fn().mockResolvedValue(product),
    });

    const result = await productORMRepository.save(product);

    expect(result).toEqual(product);

    expect(typeorm.getRepository).toHaveBeenNthCalledWith(1, Product);
    expect(typeorm.getRepository(Product).create).toHaveBeenNthCalledWith(
      1,
      product
    );
    expect(typeorm.getRepository(Product).save).toHaveBeenNthCalledWith(
      1,
      product
    );
  });

  it("should call typeorm getRepository's product save methods on product update", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOneOrFail: jest.fn().mockResolvedValue(product),
      save: jest.fn().mockResolvedValue(product),
    });

    const result = await productORMRepository.update(product.id, product);

    expect(result).toEqual(product);

    expect(typeorm.getRepository).toHaveBeenNthCalledWith(1, Product);
    expect(typeorm.getRepository(Product).save).toHaveBeenNthCalledWith(
      1,
      product
    );
  });

  it("should call typeorm getRepository's product delete methods on product delete", async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      delete: jest.fn().mockReturnValue(null),
    });

    await productORMRepository.deleteById(product.id);

    expect(typeorm.getRepository).toHaveBeenNthCalledWith(1, Product);
    expect(typeorm.getRepository(Product).delete).toHaveBeenNthCalledWith(
      1,
      product.id
    );
  });
});
