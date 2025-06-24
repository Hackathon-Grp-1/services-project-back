import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Swagger example user not found
 */
export class SwaggerUserNotFound {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;

  @ApiProperty({ example: 'User 5 not found ' })
  message: string;
}
/**
 * Swagger example for already existing user
 */
export class SwaggerUserAlreadyExists {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({ example: 'User already exists' })
  message: string;
}
