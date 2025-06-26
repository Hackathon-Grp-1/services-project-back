import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConfirmEmail1750948445197 implements MigrationInterface {
  name = 'ConfirmEmail1750948445197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user"
        ADD "email_confirmed" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
        ALTER TABLE "user"
        ADD "email_confirmation_token" character varying
    `);
    await queryRunner.query(`
        ALTER TABLE "user"
        ADD "email_confirmation_token_expires" TIMESTAMP
    `);

    await queryRunner.query(`
        UPDATE "user" 
        SET "email_confirmed" = true 
        WHERE "created_at" < NOW()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user" DROP COLUMN "email_confirmation_token_expires"
    `);
    await queryRunner.query(`
        ALTER TABLE "user" DROP COLUMN "email_confirmation_token"
    `);
    await queryRunner.query(`
        ALTER TABLE "user" DROP COLUMN "email_confirmed"
    `);
  }
}
