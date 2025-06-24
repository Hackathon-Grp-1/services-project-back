import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DefaultSortableFields, FilterOp, PaginatedList, SortOrder } from './paginator.type';

@ValidatorConstraint({ name: 'IsValidFilterOpArray', async: false })
class IsValidFilterOpArray implements ValidatorConstraintInterface {
  validate(values: string): boolean {
    const filterOpValues = Object.values(FilterOp);
    const valueArray = values.split(',');
    return valueArray.every((value) => filterOpValues.includes(value as FilterOp));
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} contains invalid values. Allowed values: ${Object.values(FilterOp).join(
      ' | ',
    )}`;
  }
}

export class PaginationParamsDto {
  @ApiPropertyOptional({
    example: 0,
    description: 'Retrieve a subset of records',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Max results to fetch.<br>Example : 10',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sorting order',
    default: SortOrder.DESC,
    enum: SortOrder,
  })
  @IsEnum(SortOrder, {
    message: `Unknown sort order. Allowed values: ${Object.values(SortOrder).join(' | ')}`,
  })
  @IsOptional()
  sortOrder?: SortOrder;

  @ApiPropertyOptional({
    example: DefaultSortableFields.CREATED_DATE_FIELD,
    description: 'Sorting field',
  })
  @Transform((params: { value: string }) => {
    return params.value === 'description' ? null : params.value;
  })
  @IsEnum(DefaultSortableFields, {
    message: `Unknown sort field. Allowed values: ${Object.values(DefaultSortableFields).join(' | ')}`,
  })
  @IsOptional()
  sortField?: string;

  @ApiPropertyOptional({
    description: 'Search a value in multiple columns.<br>Example : John',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to filter on.<br>Example: firstName',
  })
  @IsOptional()
  filterField?: string;

  @ApiPropertyOptional({
    description: 'Filter operator can be contains, equals...',
    enum: FilterOp,
  })
  @Validate(IsValidFilterOpArray, ['FilterOp'])
  @IsOptional()
  @ValidateIf((obj: PaginationParamsDto) => obj.filterOp !== undefined || obj.filterField !== '' || obj.filter !== '')
  filterOp?: string;

  @ApiPropertyOptional({ description: 'Filter value.<br>Example : active' })
  @IsOptional()
  filter?: string;
}

export class PaginatedResponseDto<resultsType> extends PaginationParamsDto implements PaginatedList<resultsType> {
  /** Current results */
  @ApiProperty({ description: 'Total of current results', example: 1 })
  @IsNumber()
  public currentResults: number;

  /** Total results */
  @ApiProperty({ description: 'Total results', example: 1 })
  @IsNumber()
  public totalResults: number;

  @ApiProperty({ description: 'Results' })
  results: resultsType[];
}
