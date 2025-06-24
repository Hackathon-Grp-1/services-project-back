import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, ValidateIf } from 'class-validator';
import { ServiceType } from '../entities/service.entity';

export class UpdateServiceDto {
  @ApiProperty({ required: false, enum: ServiceType, description: 'Type de service: prestataire humain ou agent IA' })
  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  user?: number;

  @ApiProperty({ required: false, description: 'Prénom (requis pour les prestataires humains)' })
  @ValidateIf(o => o.serviceType === ServiceType.HUMAN_PROVIDER)
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Nom de famille (requis pour les prestataires humains)' })
  @ValidateIf(o => o.serviceType === ServiceType.HUMAN_PROVIDER)
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: 'Nom de l\'agent IA (requis pour les agents IA)' })
  @ValidateIf(o => o.serviceType === ServiceType.AI_AGENT)
  @IsOptional()
  @IsString()
  aiAgentName?: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  organization?: number;

  @ApiProperty({ required: false, description: 'Téléphone (requis pour les prestataires humains)' })
  @ValidateIf(o => o.serviceType === ServiceType.HUMAN_PROVIDER)
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'Taux horaire en euros' })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @ApiProperty({ required: false, description: 'Description professionnelle détaillée' })
  @IsOptional()
  @IsString()
  professionalDescription?: string;

  @ApiProperty({ required: false, description: 'Description des compétences détaillée' })
  @IsOptional()
  @IsString()
  skillsDescription?: string;

  @ApiProperty({ required: false, type: [String], description: 'Liste des compétences' })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({ required: false, description: 'Domaine d\'expertise' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({ required: false, description: 'Description professionnelle courte' })
  @IsOptional()
  @IsString()
  shortProfessionalDescription?: string;

  @ApiProperty({ required: false, description: 'Description des compétences courte' })
  @IsOptional()
  @IsString()
  shortSkillsDescription?: string;

  @ApiProperty({ required: false, description: 'Modèle d\'IA utilisé (requis pour les agents IA)' })
  @ValidateIf(o => o.serviceType === ServiceType.AI_AGENT)
  @IsOptional()
  @IsString()
  aiModel?: string;

  @ApiProperty({ required: false, description: 'Version de l\'agent IA (requis pour les agents IA)' })
  @ValidateIf(o => o.serviceType === ServiceType.AI_AGENT)
  @IsOptional()
  @IsString()
  aiVersion?: string;
} 