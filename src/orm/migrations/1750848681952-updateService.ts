import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateService1750848681952 implements MigrationInterface {
  name = 'UpdateService1750848681952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "services"
        ADD "localization" character varying(256)
    `);
    await queryRunner.query(`
        ALTER TABLE "services" DROP COLUMN "domain"
    `);
    await queryRunner.query(`
        ALTER TABLE "services"
        ADD "domain" character varying(64) array
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "services" DROP COLUMN "domain"
    `);
    await queryRunner.query(`
        ALTER TABLE "services"
        ADD "domain" character varying(64) NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "services" DROP COLUMN "localization"
    `);
  }
}
