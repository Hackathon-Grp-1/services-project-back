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

export class UpdateServiceDto {
  @ApiProperty({ type: String, required: false, description: 'Type de service: "human_provider" ou "ai_agent"' })
  @IsEnum(['human_provider', 'ai_agent'])
  serviceType: 'human_provider' | 'ai_agent';

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  user?: number;

  @ApiProperty({ required: false, description: 'Prénom (requis pour les prestataires humains)' })
  @ValidateIf((o: UpdateServiceDto) => o.serviceType === 'human_provider')
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Nom de famille (requis pour les prestataires humains)' })
  @ValidateIf((o: UpdateServiceDto) => o.serviceType === 'human_provider')
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: "Nom de l'agent IA (requis pour les agents IA)" })
  @ValidateIf((o: UpdateServiceDto) => o.serviceType === 'ai_agent')
  @IsOptional()
  @IsString()
  aiAgentName?: string;

  @ApiProperty({ required: false, description: 'Nom de l\'organisation' })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiProperty({ required: false, description: 'Téléphone (requis pour les prestataires humains)' })
  @ValidateIf((o: UpdateServiceDto) => o.serviceType === 'human_provider')
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

  @ApiProperty({ required: false, description: "Domaine d'expertise" })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  domains?: string[];

  @ApiProperty({ required: false, description: 'Description professionnelle courte' })
  @IsOptional()
  @IsString()
  shortProfessionalDescription?: string;

  @ApiProperty({ required: false, description: 'Description des compétences courte' })
  @IsOptional()
  @IsString()
  shortSkillsDescription?: string;

  @ApiProperty({ required: false, description: "Modèle d'IA utilisé (requis pour les agents IA)" })
  @ValidateIf((o: UpdateServiceDto) => o.serviceType === 'ai_agent')
  @IsOptional()
  @IsString()
  aiModel?: string;

  @ApiProperty({ required: false, description: "Version de l'agent IA (requis pour les agents IA)" })
  @ValidateIf((o: UpdateServiceDto) => o.serviceType === 'ai_agent')
  @IsOptional()
  @IsString()
  aiVersion?: string;

  @ApiProperty({ required: false, description: 'Localisation (ville, pays...)' })
  @IsOptional()
  @IsString()
  localization?: string;
}
