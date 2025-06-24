import { CommonErrorCode, CustomHttpException, ErrorDetails } from '@common/helpers/error-codes/custom.exception';
import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';

export enum AuthErrorCode {
  FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
  NO_TOKEN = 'NO_TOKEN',
  NO_ACTIVE_ACCOUNT = 'NO_ACTIVE_ACCOUNT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  REQUEST_USER_NOT_FOUND = 'REQUEST_USER_NOT_FOUND',
  UNKNOWN_VALIDATE_ERROR = 'UNKNOWN_VALIDATE_ERROR',
}

type ErrorCode = CommonErrorCode | AuthErrorCode;

export class AuthHttpException extends CustomHttpException {
  declare readonly code: AuthErrorCode;

  constructor(code: ErrorCode, status: HttpStatus, details?: ErrorDetails, options?: HttpExceptionOptions) {
    super(code, status, details, options);
  }

  getMessage() {
    const messages: Record<AuthErrorCode, string> = {
      [AuthErrorCode.FORBIDDEN_ACCESS]: "You haven't correct rights to access on this resource",
      [AuthErrorCode.NO_TOKEN]: 'Token not found in headers',
      [AuthErrorCode.NO_ACTIVE_ACCOUNT]: 'No active account found',
      [AuthErrorCode.INVALID_TOKEN]: 'Invalid bearer token in the headers',
      [AuthErrorCode.TOKEN_EXPIRED]: 'JWT token is expired',
      [AuthErrorCode.INVALID_CREDENTIALS]: 'User or password invalid',
      [AuthErrorCode.REQUEST_USER_NOT_FOUND]: 'User not found in request',
      [AuthErrorCode.UNKNOWN_VALIDATE_ERROR]: 'Unknown error occurred during validation',
    };

    return messages[this.code] || null;
  }
}

export class AuthForbiddenException extends AuthHttpException {
  constructor(details?: Record<string, string | number>) {
    super(AuthErrorCode.FORBIDDEN_ACCESS, HttpStatus.FORBIDDEN, details);
  }
}

export class InvalidBearerTokenException extends AuthHttpException {
  constructor(details?: Record<string, string | number>) {
    super(AuthErrorCode.INVALID_TOKEN, HttpStatus.UNAUTHORIZED, details);
  }
}

export class TokenExpiredTokenException extends AuthHttpException {
  constructor() {
    super(AuthErrorCode.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
  }
}

export class AuthNoTokenException extends AuthHttpException {
  constructor() {
    super(AuthErrorCode.NO_TOKEN, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidCredentialsException extends AuthHttpException {
  constructor() {
    super(AuthErrorCode.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
  }
}

export class DeactivateAccountException extends AuthHttpException {
  constructor() {
    super(AuthErrorCode.NO_ACTIVE_ACCOUNT, HttpStatus.UNAUTHORIZED);
  }
}

export class UserRequestNotFoundException extends AuthHttpException {
  constructor() {
    super(AuthErrorCode.REQUEST_USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
  }
}

export class AuthUnknownException extends AuthHttpException {
  constructor() {
    super(AuthErrorCode.UNKNOWN_VALIDATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
