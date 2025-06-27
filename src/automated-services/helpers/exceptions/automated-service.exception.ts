import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { CommonErrorCode, CustomHttpException, ErrorDetails } from 'src/common/helpers/error-codes/custom.exception';

export enum AutomatedServiceErrorCode {
  NOT_FOUND = 'NOT_FOUND',
}

type ErrorCode = CommonErrorCode | AutomatedServiceErrorCode;

export class AutomatedServiceHttpException extends CustomHttpException {
  declare readonly code: AutomatedServiceErrorCode;

  constructor(code: ErrorCode, status: HttpStatus, details?: ErrorDetails, options?: HttpExceptionOptions) {
    super(code, status, details, options);
  }

  getMessage() {
    const messages: Record<AutomatedServiceErrorCode, string> = {
      [AutomatedServiceErrorCode.NOT_FOUND]: 'Automated service not found',
    };
    return messages[this.code] || null;
  }
}

export class AutomatedServiceNotFoundException extends AutomatedServiceHttpException {
  constructor(details?: Record<string, string | number>) {
    super(AutomatedServiceErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
