import { Product } from '~/types';

export default interface ProductRepository {
  all(
    filter?: string,
    orderBy?: string,
    skip?: number,
    count?: number
  ): Promise<Product[]>;

  findById(id?: string): Promise<Product>;

  deleteById(id: string): Promise<void>;

  save(data: Product): Promise<Product>;

  update(id: string, data: Product): Promise<Product>;
}
