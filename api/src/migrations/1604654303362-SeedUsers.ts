import { MigrationInterface, QueryRunner } from 'typeorm';

import { populateUsers } from '@Helpers/seed';

export class SeedUsers1604654303362 implements MigrationInterface {
  public async up(): Promise<void> {
    await populateUsers();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE `users`');
  }
}
