import { ApiResponseOptions } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { SwaggerUserAlreadyExists, SwaggerUserNotFound } from '../types/user-swagger-response.types';

export class UserConfigSwagger {
  static readonly SUCCESS_USER_CREATE: ApiResponseOptions = {
    description: 'The user has been successfully created',
    type: User,
  };
  static readonly USER_ALREADY_EXIST: ApiResponseOptions = {
    description: 'User already exists',
    type: SwaggerUserAlreadyExists,
  };
  static readonly USER_NOT_FOUND: ApiResponseOptions = { description: 'User not found', type: SwaggerUserNotFound };
}
