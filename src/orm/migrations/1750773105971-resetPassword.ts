import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResetPassword1750773105971 implements MigrationInterface {
  name = 'ResetPassword1750773105971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "reset_password_token" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "reset_password_token_expires" TIMESTAMP
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "reset_password_token_expires"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "reset_password_token"
        `);
  }
}
