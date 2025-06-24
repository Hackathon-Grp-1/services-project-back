import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { CustomHttpException } from '../helpers/error-codes/custom.exception';
import { HttpErrorCode } from '../helpers/error-codes/http-error-codes';
import { HttpErrorMessage } from '../helpers/error-codes/http-error-messages';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = +exception.getStatus();
    const code = exception.code ?? HttpErrorCode[status] ?? 'UNEXPECTED_ERROR';
    const message = exception.message || HttpErrorMessage[code] || 'An unknown error occurred';

    response.status(status).json({
      status,
      code,
      message,
      details: exception.details,
      timestamp: new Date().getTime(),
    });
  }
}
