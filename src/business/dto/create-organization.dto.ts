import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrganizationEconomicSizeKind } from '../types/organization.types';

export class CreateOrganizationDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  author: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  owner?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ enum: OrganizationEconomicSizeKind, default: OrganizationEconomicSizeKind.FREELANCER })
  @IsOptional()
  @IsEnum(OrganizationEconomicSizeKind)
  oSize?: OrganizationEconomicSizeKind;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  juridicForm?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  juridicCatLabel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  juridicCatCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  legalUniqIdentifier?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vatNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  communityVatNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  capital?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  insuranceRef?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  insuranceName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  activityStartedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  activityEndedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentOrganization?: number;
}
