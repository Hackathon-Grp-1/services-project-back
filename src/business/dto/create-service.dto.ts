import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ type: String, description: 'Type de service: "human_provider" ou "ai_agent"' })
  @IsEnum(['human_provider', 'ai_agent'])
  serviceType: 'human_provider' | 'ai_agent';

  @ApiProperty({ type: 'number' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  user: number;

  @ApiProperty({ required: false, description: 'Prénom (requis pour les prestataires humains)' })
  @ValidateIf((o: CreateServiceDto) => o.serviceType === 'human_provider')
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Nom de famille (requis pour les prestataires humains)' })
  @ValidateIf((o: CreateServiceDto) => o.serviceType === 'human_provider')
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: "Nom de l'agent IA (requis pour les agents IA)" })
  @ValidateIf((o: CreateServiceDto) => o.serviceType === 'ai_agent')
  @IsString()
  aiAgentName?: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  organization?: string;

  @ApiProperty({ required: false, description: 'Téléphone (requis pour les prestataires humains)' })
  @ValidateIf((o: CreateServiceDto) => o.serviceType === 'human_provider')
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Taux horaire en euros' })
  @IsNumber()
  hourlyRate: number;

  @ApiProperty({ description: 'Description professionnelle détaillée' })
  @IsString()
  professionalDescription: string;

  @ApiProperty({ description: 'Description des compétences détaillée' })
  @IsString()
  skillsDescription: string;

  @ApiProperty({ type: [String], description: 'Liste des compétences' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({ description: "Domaine d'expertise" })
  @IsString()
  domain: string;

  @ApiProperty({ description: 'Description professionnelle courte' })
  @IsString()
  shortProfessionalDescription: string;

  @ApiProperty({ description: 'Description des compétences courte' })
  @IsString()
  shortSkillsDescription: string;

  @ApiProperty({ required: false, description: "Modèle d'IA utilisé (requis pour les agents IA)" })
  @ValidateIf((o: CreateServiceDto) => o.serviceType === 'ai_agent')
  @IsString()
  aiModel?: string;

  @ApiProperty({ required: false, description: "Version de l'agent IA (requis pour les agents IA)" })
  @ValidateIf((o: CreateServiceDto) => o.serviceType === 'ai_agent')
  @IsString()
  aiVersion?: string;

  @ApiProperty({ description: 'Localisation (ville, pays...)' })
  @IsString()
  localization: string;
}
