import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { DtoErrorDetail } from './validation-error.helper';

export type ErrorDetails = Record<string, string | number | DtoErrorDetail[]>;

export enum CommonErrorCode {
  INVALID_DTO = 'INVALID_DTO',
}

export abstract class CustomHttpException extends HttpException {
  public readonly code: string;
  private readonly _details?: Record<string, string | number | DtoErrorDetail[]>;

  constructor(code: string, status: HttpStatus, details?: ErrorDetails, options?: HttpExceptionOptions) {
    super(code, status, options);

    this.code = code;
    this._details = details;
    this.message = this.getMessage() || this.defaultMessage();
  }

  get details() {
    return this._details;
  }

  abstract getMessage(): string | null;

  private defaultMessage(): string {
    const messages: Record<string, string> = {
      [CommonErrorCode.INVALID_DTO]: 'Invalid DTO',
    };

    return messages[this.code] ?? '';
  }
}

export class InvalidDtoException extends CustomHttpException {
  constructor(errors: DtoErrorDetail[]) {
    super(CommonErrorCode.INVALID_DTO, HttpStatus.BAD_REQUEST, { errors });
  }

  getMessage() {
    return 'Error on submitted data';
  }
}
