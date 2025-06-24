import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { SoftDeleteEntity } from '../../common/entities/soft-delete.entity';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';

export enum ServiceType {
  HUMAN_PROVIDER = 'human_provider',
  AI_AGENT = 'ai_agent',
}

@Entity('services')
export class Service extends SoftDeleteEntity {
  @ApiProperty({ enum: ServiceType, description: 'Type de service: prestataire humain ou agent IA' })
  @Column({
    name: 'service_type',
    type: 'enum',
    enum: ServiceType,
    default: ServiceType.HUMAN_PROVIDER
  })
  serviceType: ServiceType;

  @ApiProperty({ required: false, description: 'Prénom (pour les prestataires humains)' })
  @Column({ name: 'first_name', type: 'varchar', length: 64, nullable: true })
  firstName?: string;

  @ApiProperty({ required: false, description: 'Nom de famille (pour les prestataires humains)' })
  @Column({ name: 'last_name', type: 'varchar', length: 64, nullable: true })
  lastName?: string;

  @ApiProperty({ required: false, description: 'Nom de l\'agent IA' })
  @Column({ name: 'ai_agent_name', type: 'varchar', length: 128, nullable: true })
  aiAgentName?: string;

  @ApiProperty({ required: false, type: () => Organization })
  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;

  @ApiProperty({ required: false, description: 'Téléphone (pour les prestataires humains)' })
  @Column({ name: 'phone', type: 'varchar', length: 32, nullable: true })
  phone?: string;

  @ApiProperty({ description: 'Taux horaire en euros' })
  @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2 })
  hourlyRate: number;

  @ApiProperty({ description: 'Description professionnelle détaillée' })
  @Column({ name: 'professional_description', type: 'text' })
  professionalDescription: string;

  @ApiProperty({ description: 'Description des compétences détaillée' })
  @Column({ name: 'skills_description', type: 'text' })
  skillsDescription: string;

  @ApiProperty({ type: [String], description: 'Liste des compétences' })
  @Column({ name: 'skills', type: 'simple-array' })
  skills: string[];

  @ApiProperty({ description: 'Domaine d\'expertise' })
  @Column({ name: 'domain', type: 'varchar', length: 64 })
  domain: string;

  @ApiProperty({ description: 'Description professionnelle courte' })
  @Column({ name: 'short_professional_description', type: 'varchar', length: 256 })
  shortProfessionalDescription: string;

  @ApiProperty({ description: 'Description des compétences courte' })
  @Column({ name: 'short_skills_description', type: 'varchar', length: 256 })
  shortSkillsDescription: string;

  @ApiProperty({ required: false, description: 'Modèle d\'IA utilisé (pour les agents IA)' })
  @Column({ name: 'ai_model', type: 'varchar', length: 128, nullable: true })
  aiModel?: string;

  @ApiProperty({ required: false, description: 'Version de l\'agent IA' })
  @Column({ name: 'ai_version', type: 'varchar', length: 32, nullable: true })
  aiVersion?: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: false })
  user: User;
}
