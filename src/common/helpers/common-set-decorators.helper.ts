import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CommonConfigSwagger } from './common-swagger-config.helper';

export const SwaggerFailureResponse = () => {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiUnauthorizedResponse(CommonConfigSwagger.RES_UNAUTHORIZE),
    ApiForbiddenResponse(CommonConfigSwagger.RES_FORBIDDEN),
  );
};
