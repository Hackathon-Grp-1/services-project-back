import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { CustomHttpException, ErrorDetails } from 'src/common/helpers/error-codes/custom.exception';

export enum OrganizationErrorCode {
  NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
}

type OrganizationError = OrganizationErrorCode;

export class OrganizationHttpException extends CustomHttpException {
  declare readonly code: OrganizationErrorCode;

  constructor(code: OrganizationError, status: HttpStatus, details?: ErrorDetails, options?: HttpExceptionOptions) {
    super(code, status, details, options);
  }

  getMessage() {
    const messages: Record<OrganizationErrorCode, string> = {
      [OrganizationErrorCode.NOT_FOUND]: 'Organization not found',
    };
    return messages[this.code] || null;
  }
}

export class OrganizationNotFoundException extends OrganizationHttpException {
  constructor(details?: Record<string, string | number>) {
    super(OrganizationErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}
