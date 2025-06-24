import { Type as NestType, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from './paginator.dto';

/**
 * Util decorator to apply the API documentation on PaginatedResponse endpoint
 * @param dataDto
 * @param options
 * @returns
 */
export const ApiOkResponsePaginated = <DataDto extends NestType<unknown>>(
  dataDto: DataDto,
  options?: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, dataDto),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
