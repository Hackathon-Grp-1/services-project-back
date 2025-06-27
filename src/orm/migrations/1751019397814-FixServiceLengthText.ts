import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixServiceLengthText1751019397814 implements MigrationInterface {
  name = 'FixServiceLengthText1751019397814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "services" DROP COLUMN "short_professional_description"
    `);
    await queryRunner.query(`
        ALTER TABLE "services"
        ADD "short_professional_description" text NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "services" DROP COLUMN "short_professional_description"
    `);
    await queryRunner.query(`
        ALTER TABLE "services"
        ADD "short_professional_description" character varying(256) NOT NULL
    `);
  }
}
