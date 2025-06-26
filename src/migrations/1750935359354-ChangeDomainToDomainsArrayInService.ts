import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDomainToDomainsArrayInService1750935359354 implements MigrationInterface {
    name = 'ChangeDomainToDomainsArrayInService1750935359354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "services"
                RENAME COLUMN "domain" TO "domains"
        `);
        await queryRunner.query(`
            ALTER TABLE "services" DROP COLUMN "domains"
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
            ADD "domains" text NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "services" DROP COLUMN "domains"
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
            ADD "domains" character varying(64) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "services"
                RENAME COLUMN "domains" TO "domain"
        `);
    }

}
