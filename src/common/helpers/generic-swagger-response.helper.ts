import { ApiResponseOptions } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { CustomHttpException, ErrorDetails, InvalidDtoException } from './error-codes/custom.exception';

const DEFAULT_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', nullable: false },
    errorCode: { type: 'string', nullable: false },
    message: { type: 'string', nullable: false },
    details: { type: 'object' },
  },
};

export const genericSwaggerErrorResponse = (
  customHttpException: CustomHttpException,
  responseDescription?: string,
  detailsKeys?: string[],
): ApiResponseOptions => {
  const properties: {
    [key: string]: number | string | CustomHttpException | ErrorDetails;
  } = {
    statusCode: customHttpException.getStatus(),
    message: {},
  };

  if (detailsKeys?.length && customHttpException) {
    const exampleDetails = detailsKeys.reduce<ErrorDetails>((acc, curr) => {
      acc[curr] =
        customHttpException instanceof InvalidDtoException
          ? [
              {
                field: '{fieldA}',
                messages: ['{messageA}'],
                value: '{valueA}',
              },
              {
                field: '{fieldB}',
                children: [
                  {
                    field: '{field1}',
                    messages: ['{message1}'],
                    value: '{value1}',
                  },
                ],
              },
            ]
          : `{${curr}}`;
      return acc;
    }, {});

    const exampleMessage = customHttpException.message;
    properties['message'] = exampleMessage;
    properties['errorCode'] = customHttpException.code;
    properties['details'] = exampleDetails;
  } else if (customHttpException) {
    properties['message'] = customHttpException.message;
    properties['errorCode'] = customHttpException.code;
  }

  return {
    description: responseDescription ?? customHttpException.message,
    schema: { ...DEFAULT_REQUEST_SCHEMA, example: properties },
  };
};

export const multipleSwaggerErrorResponse = (
  examples: Record<string, ApiResponseOptions>,
  responseDescription: string | undefined = 'Bad request',
  schema: SchemaObject | undefined = DEFAULT_REQUEST_SCHEMA,
): ApiResponseOptions => ({
  description: responseDescription,

  schema,
  examples: Object.fromEntries(
    Object.entries(examples).map(([key, value]) =>
      'schema' in value ? [key, { summary: key, value: value.schema.example }] : [key, { summary: key, value }],
    ),
  ),
});
