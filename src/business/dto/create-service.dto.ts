import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ type: 'number' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  user: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  organization?: number;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNumber()
  hourlyRate: number;

  @ApiProperty()
  @IsString()
  professionalDescription: string;

  @ApiProperty()
  @IsString()
  skillsDescription: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty()
  @IsString()
  domain: string;

  @ApiProperty()
  @IsString()
  shortProfessionalDescription: string;

  @ApiProperty()
  @IsString()
  shortSkillsDescription: string;
}
