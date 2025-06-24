import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiOkResponsePaginated } from '@paginator/paginator.decorator';
import { User } from '../entities/user.entity';
import { UserConfigSwagger } from './user-config-swagger.helper';

export const SwaggerUserCreate = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create a user' }),
    ApiCreatedResponse(UserConfigSwagger.SUCCESS_USER_CREATE),
    ApiBadRequestResponse(UserConfigSwagger.USER_ALREADY_EXIST),
  );
};

export const SwaggerUserFindAll = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiOkResponsePaginated(User, { description: 'Users list' }),
  );
};

export const SwaggerUserFindAllVisitors = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all visitor users' }),
    ApiOkResponsePaginated(User, { description: 'Visitors list' }),
  );
};

export const SwaggerUserFindOne = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user by id' }),
    ApiOkResponse({ description: 'User', type: User }),
    ApiNotFoundResponse(UserConfigSwagger.USER_NOT_FOUND),
  );
};

export const SwaggerUserPatch = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user by id' }),
    ApiNotFoundResponse(UserConfigSwagger.USER_NOT_FOUND),
  );
};

export const SwaggerUserResetApiKey = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Reset user apiKey by id' }),
    ApiNotFoundResponse(UserConfigSwagger.USER_NOT_FOUND),
  );
};

export const SwaggerUserUpdateState = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Archive or restore user by id' }),
    ApiOkResponse({
      examples: {
        archive: { summary: 'Archive user', value: 'User archived' },
        restore: { summary: 'Restore user', value: 'User restored' },
      },
    }),
    ApiNotFoundResponse(UserConfigSwagger.USER_NOT_FOUND),
  );
};
