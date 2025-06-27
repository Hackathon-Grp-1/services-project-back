import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceDomainsLocalization1750944166630 implements MigrationInterface {
  name = 'ServiceDomainsLocalization1750944166630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "services" DROP COLUMN "domain"
        `);
    await queryRunner.query(`
            ALTER TABLE "services"
            ADD "domains" text
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "services" DROP COLUMN "domains"
        `);
    await queryRunner.query(`
            ALTER TABLE "services"
            ADD "domain" character varying(64) NOT NULL
        `);
  }
}
