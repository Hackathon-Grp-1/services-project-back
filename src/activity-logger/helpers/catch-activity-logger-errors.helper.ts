import { BadRequestException } from '@nestjs/common';
import { CustomHttpException } from '@src/common/helpers/error-codes/custom.exception';
import _ from 'lodash';

const catchActivityLoggerError = (error: unknown, statusCode: number) => {
  let responseError: string | object;

  if (error instanceof CustomHttpException) {
    responseError = error;
    statusCode = error.getStatus();
  } else if (error instanceof BadRequestException) {
    statusCode = error.getStatus();
    const badRequestResponse = error.getResponse();
    if (typeof badRequestResponse === 'string') {
      responseError = badRequestResponse;
    } else if (typeof badRequestResponse === 'object' && _.has(badRequestResponse, 'message')) {
      responseError = badRequestResponse['message'];
    } else {
      responseError = badRequestResponse;
    }
  } else if (error instanceof Error) {
    responseError = error.message;
  } else {
    responseError = 'Unknown error';
  }

  return { responseError, httpStatus: statusCode };
};

export default catchActivityLoggerError;
