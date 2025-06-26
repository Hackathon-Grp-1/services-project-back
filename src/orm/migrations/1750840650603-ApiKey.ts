import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApiKey1750840650603 implements MigrationInterface {
  name = 'ApiKey1750840650603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_type_enum" AS ENUM('API', 'INTERNAL')
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "type" "public"."user_type_enum" NOT NULL DEFAULT 'INTERNAL'
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "api_key" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_55518b11e5013893f3b9f074209" UNIQUE ("api_key")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "email" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "password" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "password"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "email"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_55518b11e5013893f3b9f074209"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "api_key"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "type"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_type_enum"
        `);
  }
}
