import { MigrationInterface, QueryRunner } from 'typeorm';

export class Services1750768363627 implements MigrationInterface {
  name = 'Services1750768363627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."organizations_o_size_enum" AS ENUM('FREELANCER', 'TPE', 'PME', 'ETI', 'GE')
        `);
    await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "legal_name" character varying(64),
                "brand" character varying(32),
                "o_size" "public"."organizations_o_size_enum" NOT NULL DEFAULT 'FREELANCER',
                "juridic_form" character varying(8),
                "juridic_cat_label" character varying(64),
                "juridic_cat_code" character varying(8),
                "currency" character varying(8) NOT NULL DEFAULT 'eur',
                "legal_uniq_identifier" character varying(64),
                "vat_number" character varying(32),
                "community_vat_number" character varying(32),
                "capital" integer,
                "insurance_ref" character varying(64),
                "insurance_name" character varying(64),
                "activity_started_at" TIMESTAMP,
                "activity_ended_at" TIMESTAMP,
                "description" text,
                "summary" text,
                "author_id" integer NOT NULL,
                "owner_id" integer,
                "parent_organization_id" integer,
                CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "services" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "first_name" character varying(64) NOT NULL,
                "last_name" character varying(64) NOT NULL,
                "phone" character varying(32) NOT NULL,
                "hourly_rate" numeric(10, 2) NOT NULL,
                "professional_description" text NOT NULL,
                "skills_description" text NOT NULL,
                "skills" text NOT NULL,
                "domain" character varying(64) NOT NULL,
                "short_professional_description" character varying(256) NOT NULL,
                "short_skills_description" character varying(256) NOT NULL,
                "organization_id" integer,
                "user_id" integer NOT NULL,
                CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "organizations"
            ADD CONSTRAINT "FK_25081f1408fba8b04e83fad93ad" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organizations"
            ADD CONSTRAINT "FK_e08c0b40ce104f44edf060126fe" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organizations"
            ADD CONSTRAINT "FK_b2942c2abac6a57dffac221431f" FOREIGN KEY ("parent_organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "services"
            ADD CONSTRAINT "FK_119ca18c4d0caacb1763042521e" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "services"
            ADD CONSTRAINT "FK_421b94f0ef1cdb407654e67c59e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "services" DROP CONSTRAINT "FK_421b94f0ef1cdb407654e67c59e"
        `);
    await queryRunner.query(`
            ALTER TABLE "services" DROP CONSTRAINT "FK_119ca18c4d0caacb1763042521e"
        `);
    await queryRunner.query(`
            ALTER TABLE "organizations" DROP CONSTRAINT "FK_b2942c2abac6a57dffac221431f"
        `);
    await queryRunner.query(`
            ALTER TABLE "organizations" DROP CONSTRAINT "FK_e08c0b40ce104f44edf060126fe"
        `);
    await queryRunner.query(`
            ALTER TABLE "organizations" DROP CONSTRAINT "FK_25081f1408fba8b04e83fad93ad"
        `);
    await queryRunner.query(`
            DROP TABLE "services"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."organizations_o_size_enum"
        `);
  }
}
