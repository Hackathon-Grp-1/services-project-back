import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FormattedCreatedUserDto } from '@src/users/dto/user/create-user.dto';
import { AuthConfigSwagger } from './auth-config-swagger.helper';

export const SwaggerAuthSignIn = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in to the application' }),
    ApiCreatedResponse(AuthConfigSwagger.SUCCESS_SIGN_IN),
    ApiUnauthorizedResponse(AuthConfigSwagger.INVALID_CREDENTIALS),
  );
};

export const SwaggerAuthCreateUserRequest = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user request with company and plan' }),
    ApiCreatedResponse({
      description: 'The user request has been successfully created',
      type: FormattedCreatedUserDto,
    }),
    ApiBadRequestResponse(AuthConfigSwagger.USER_ALREADY_EXIST),
  );
};
