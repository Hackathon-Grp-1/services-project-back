import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutomatedServices1750983392088 implements MigrationInterface {
  name = 'AutomatedServices1750983392088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "automated_services" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "name" character varying(255) NOT NULL,
            "description" text NOT NULL,
            "category" character varying(100) NOT NULL,
            "provider" json NOT NULL,
            "pricing" json NOT NULL,
            "configuration" json NOT NULL,
            "usage" json NOT NULL,
            "metadata" json NOT NULL,
            CONSTRAINT "PK_e0f52e2df59b047a5b5c3f81fe7" PRIMARY KEY ("id")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "automated_services"
    `);
  }
}
