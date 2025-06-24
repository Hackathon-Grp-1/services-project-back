import { ApiResponseOptions } from '@nestjs/swagger';
import { SwaggerUserAlreadyExists } from '@src/users/types/user-swagger-response.types';
import { SwaggerLoggedUserWithToken } from '../types/auth-swagger-response.types';

export class AuthConfigSwagger {
  static readonly SUCCESS_SIGN_IN: ApiResponseOptions = {
    description: 'User successfully signed in',
    type: SwaggerLoggedUserWithToken,
  };

  static readonly INVALID_CREDENTIALS: ApiResponseOptions = {
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
      },
    },
  };

  static readonly USER_ALREADY_EXIST: ApiResponseOptions = {
    description: 'User already exists',
    type: SwaggerUserAlreadyExists,
  };
}
