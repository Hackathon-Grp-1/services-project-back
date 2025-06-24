import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationParamsDto } from '@paginator/paginator.dto';
import { IsEnum, IsOptional } from 'class-validator';

enum UserEntityFields {
  ID = 'id',
  NAME = 'name',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DELETED_AT = 'deletedAt',
}

export class UserQueryFilterDto extends PaginationParamsDto {
  @ApiPropertyOptional({
    example: UserEntityFields.NAME,
    description: 'Name of the column to sort',
    default: UserEntityFields.CREATED_AT,
    enum: UserEntityFields,
  })
  @IsEnum(UserEntityFields)
  @IsOptional()
  sortField: string = UserEntityFields.CREATED_AT;
}
