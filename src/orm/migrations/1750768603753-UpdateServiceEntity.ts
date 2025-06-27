import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateServiceEntity1750768603753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ajouter le type enum pour les services
    await queryRunner.query(`
            CREATE TYPE "public"."services_service_type_enum" AS ENUM('human_provider', 'ai_agent')
        `);

    // Ajouter la colonne service_type avec une valeur par défaut
    await queryRunner.query(`
            ALTER TABLE "services" 
            ADD COLUMN "service_type" "public"."services_service_type_enum" NOT NULL DEFAULT 'human_provider'
        `);

    // Ajouter les nouvelles colonnes pour les agents IA
    await queryRunner.query(`
            ALTER TABLE "services" 
            ADD COLUMN "ai_agent_name" character varying(128)
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            ADD COLUMN "ai_model" character varying(128)
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            ADD COLUMN "ai_version" character varying(32)
        `);

    // Rendre les colonnes existantes nullable pour les agents IA
    await queryRunner.query(`
            ALTER TABLE "services" 
            ALTER COLUMN "first_name" DROP NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            ALTER COLUMN "last_name" DROP NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            ALTER COLUMN "phone" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les nouvelles colonnes
    await queryRunner.query(`
            ALTER TABLE "services" 
            DROP COLUMN "ai_version"
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            DROP COLUMN "ai_model"
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            DROP COLUMN "ai_agent_name"
        `);

    // Supprimer la colonne service_type
    await queryRunner.query(`
            ALTER TABLE "services" 
            DROP COLUMN "service_type"
        `);

    // Supprimer le type enum
    await queryRunner.query(`
            DROP TYPE "public"."services_service_type_enum"
        `);

    // Remettre les colonnes comme NOT NULL
    await queryRunner.query(`
            ALTER TABLE "services" 
            ALTER COLUMN "phone" SET NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            ALTER COLUMN "last_name" SET NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "services" 
            ALTER COLUMN "first_name" SET NOT NULL
        `);
  }
}
