import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import Product from '@Entities/Product';
import { products } from '@Helpers/seed';

export class SeedProducts1604657096822 implements MigrationInterface {
  public async up(): Promise<void> {
    await getRepository(Product).insert(products);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE `products`');
  }
}
