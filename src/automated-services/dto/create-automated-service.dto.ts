import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProviderDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Provider name' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'Provider avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class PricingDto {
  @ApiProperty({ enum: ['free', 'per_request', 'subscription'] })
  @IsEnum(['free', 'per_request', 'subscription'])
  type: 'free' | 'per_request' | 'subscription';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class ConfigurationDto {
  @ApiProperty({ description: 'API endpoint URL' })
  @IsString()
  endpoint: string;

  @ApiProperty({ enum: ['GET', 'POST'] })
  @IsEnum(['GET', 'POST'])
  method: 'GET' | 'POST';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bodyTemplate?: string;

  @ApiProperty()
  @IsObject()
  responseMapping: Record<string, string>;
}

export class UsageDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  totalRequests: number;

  @ApiProperty()
  @IsNumber()
  averageRating: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class ExampleDto {
  @ApiProperty()
  @IsObject()
  input: any;

  @ApiProperty()
  @IsObject()
  output: any;

  @ApiProperty()
  @IsString()
  description: string;
}

export class MetadataDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ type: [ExampleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExampleDto)
  examples: ExampleDto[];
}

export class CreateAutomatedServiceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty({ type: ProviderDto })
  @ValidateNested()
  @Type(() => ProviderDto)
  provider: ProviderDto;

  @ApiProperty({ type: PricingDto })
  @ValidateNested()
  @Type(() => PricingDto)
  pricing: PricingDto;

  @ApiProperty({ type: ConfigurationDto })
  @ValidateNested()
  @Type(() => ConfigurationDto)
  configuration: ConfigurationDto;

  @ApiProperty({ required: false, type: UsageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UsageDto)
  usage?: UsageDto;

  @ApiProperty({ required: false, type: MetadataDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;
}
