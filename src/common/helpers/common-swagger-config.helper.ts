import { ApiResponseOptions } from '@nestjs/swagger';
import { AuthForbiddenException, InvalidBearerTokenException } from 'src/auth/helpers/auth.exception';
import { CustomHttpException } from './error-codes/custom.exception';
import { genericSwaggerErrorResponse, multipleSwaggerErrorResponse } from './generic-swagger-response.helper';

type MultipleErrorResponse = {
  customHttpException: CustomHttpException;
  exampleName?: string;
};

/**
 * @param allErrors Array of objects with following properties :
 *  - customHttpException : a CustomHttpException
 *  - exampleName (optional) : surcharge CustomHttpException.message for Swagger example
 * @example
 * [{customHttpException: new CustomHttpException()}]
 * or
 * [{customHttpException: new CustomHttpException(), exampleName:"Example"}]
 */
export const SwaggerGenericMultipleErrorResponse = (
  allErrors: MultipleErrorResponse[],
  responseDescription: string | undefined = 'Bad request',
) => {
  return multipleSwaggerErrorResponse(
    Object.fromEntries(
      allErrors.map(({ exampleName, customHttpException }) => [
        exampleName ?? customHttpException.message,
        genericSwaggerErrorResponse(
          customHttpException,
          undefined,
          customHttpException.details ? Object.keys(customHttpException.details) : undefined,
        ),
      ]),
    ),
    responseDescription,
  );
};

export class CommonConfigSwagger {
  public static readonly RES_UNAUTHORIZE: ApiResponseOptions = SwaggerGenericMultipleErrorResponse(
    [{ customHttpException: new InvalidBearerTokenException() }],
    'Unauthorized',
  );
  public static readonly RES_FORBIDDEN: ApiResponseOptions = genericSwaggerErrorResponse(new AuthForbiddenException());
}
