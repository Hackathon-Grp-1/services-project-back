import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseEntities1750753341077 implements MigrationInterface {
  name = 'BaseEntities1750753341077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "activity_log" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "external_user_id" integer,
                "request_body" character varying,
                "response_body" character varying,
                "ip_address" character varying(45),
                "headers" text,
                "method" character varying NOT NULL,
                "uri" character varying NOT NULL,
                "status_code" integer NOT NULL,
                "duration" integer NOT NULL,
                "resource_name" character varying NOT NULL,
                "resource_id" character varying,
                "description" character varying,
                "user_id" integer,
                CONSTRAINT "PK_067d761e2956b77b14e534fd6f1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."role_type_enum" AS ENUM('ADMINISTRATOR', 'ENTREPRENEUR', 'CUSTOMER')
        `);
    await queryRunner.query(`
            CREATE TABLE "role" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "type" "public"."role_type_enum" NOT NULL,
                "description" character varying NOT NULL,
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "phone_number" character varying,
                "role_id" integer,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "activity_log"
            ADD CONSTRAINT "FK_81615294532ca4b6c70abd1b2e6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    // Add roles in DB
    await queryRunner.query(`
        INSERT INTO "role" ("name", "type", "description") VALUES
            ('Administrateur', 'ADMINISTRATOR', 'Administrateur possédant un accès total à l''application'),
            ('Entrepreneur', 'ENTREPRENEUR', 'Compte entrepreneur qui vend ses services'),
            ('Client', 'CUSTOMER', 'Compte client simple');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"
        `);
    await queryRunner.query(`
            ALTER TABLE "activity_log" DROP CONSTRAINT "FK_81615294532ca4b6c70abd1b2e6"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "role"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."role_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "activity_log"
        `);
  }
}
