import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrganizationColumnToServices1750934707350 implements MigrationInterface {
    name = 'AddOrganizationColumnToServices1750934707350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "services" DROP CONSTRAINT "FK_119ca18c4d0caacb1763042521e"
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
                RENAME COLUMN "organization_id" TO "organization"
        `);
        await queryRunner.query(`
            ALTER TABLE "services" DROP COLUMN "organization"
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
            ADD "organization" character varying(128)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "services" DROP COLUMN "organization"
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
            ADD "organization" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
                RENAME COLUMN "organization" TO "organization_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
            ADD CONSTRAINT "FK_119ca18c4d0caacb1763042521e" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
