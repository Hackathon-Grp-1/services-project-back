import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { CommonErrorCode, CustomHttpException, ErrorDetails } from 'src/common/helpers/error-codes/custom.exception';

export enum UserErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  DEACTIVATED_USER = 'DEACTIVATED_USER',
  CANNOT_UPDATE_OWN_ACCOUNT_STATE = 'CANNOT_UPDATE_OWN_ACCOUNT_STATE',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
}

type ErrorCode = CommonErrorCode | UserErrorCode;

export class UserHttpException extends CustomHttpException {
  declare readonly code: UserErrorCode;

  constructor(code: ErrorCode, status: HttpStatus, details?: ErrorDetails, options?: HttpExceptionOptions) {
    super(code, status, details, options);
  }

  getMessage() {
    const messages: Record<UserErrorCode, string> = {
      [UserErrorCode.NOT_FOUND]: 'User not found',
      [UserErrorCode.DEACTIVATED_USER]: 'User account has been deactivated',
      [UserErrorCode.CANNOT_UPDATE_OWN_ACCOUNT_STATE]: 'Current user cannot update this own account state',
      [UserErrorCode.EMAIL_ALREADY_EXISTS]: 'Email already exists in the database',
      [UserErrorCode.ROLE_NOT_FOUND]: 'Role not found in the database',
    };

    return messages[this.code] || null;
  }
}

export class UserNotFoundException extends UserHttpException {
  constructor(details?: Record<string, string | number>) {
    super(UserErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

export class UserDeactivateException extends UserHttpException {
  constructor(details?: Record<string, string | number>) {
    super(UserErrorCode.DEACTIVATED_USER, HttpStatus.FORBIDDEN, details);
  }
}

export class UserEmailAlreadyExistsException extends UserHttpException {
  constructor(details?: Record<string, string | number>) {
    super(UserErrorCode.EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST, details);
  }
}

export class RoleNotFoundException extends UserHttpException {
  constructor(details?: Record<string, string | number>) {
    super(UserErrorCode.ROLE_NOT_FOUND, HttpStatus.BAD_REQUEST, details);
  }
}
