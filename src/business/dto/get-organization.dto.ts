import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

enum OrganizationEntityFields {
  ID = 'id',
  NAME = 'name',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DELETED_AT = 'deletedAt',
}

export class GetOrganizationDto {
  @ApiPropertyOptional({
    example: OrganizationEntityFields.NAME,
    description: 'Name of the column to sort',
    default: OrganizationEntityFields.CREATED_AT,
    enum: OrganizationEntityFields,
  })
  @IsEnum(OrganizationEntityFields)
  @IsOptional()
  sortField: string = OrganizationEntityFields.CREATED_AT;
}
