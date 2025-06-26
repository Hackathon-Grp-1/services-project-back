import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
    ApiOperation({ summary: 'Create a new user request' }),
    ApiCreatedResponse({
      description: 'The user request has been successfully created',
      type: FormattedCreatedUserDto,
    }),
    ApiBadRequestResponse(AuthConfigSwagger.USER_ALREADY_EXIST),
  );
};

export const SwaggerAuthContact = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Send a contact form message to admin',
      description: 'Rate limited to 10 requests per hour per IP address',
    }),
    ApiOkResponse({
      description: 'The contact message has been successfully sent',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Contact message sent successfully',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad request - validation error',
    }),
    ApiTooManyRequestsResponse({
      description: 'Rate limit exceeded - too many requests',
      schema: {
        example: {
          statusCode: 429,
          message: 'ThrottlerException: Too Many Requests',
        },
      },
    }),
  );
};
