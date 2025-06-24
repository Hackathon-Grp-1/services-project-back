import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ActivityLoggerService } from '../services/activity-logger.service';
import { ActivityLoggerDecorator, LocationId } from '../types/activity-logger.types';
import catchActivityLoggerError from './catch-activity-logger-errors.helper';
import { methodMapping } from './method-mapping.helper';

interface TypedRequest extends ExpressRequest {
  body: Record<string, unknown>;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Activity logger');

  constructor(
    private readonly reflector: Reflector,
    private readonly activityLoggerService: ActivityLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const disableActivityLogger = this.reflector.get<boolean>('disableActivityLogger', context.getHandler());
    if (disableActivityLogger) return next.handle();

    const decorator = this.reflector.get<ActivityLoggerDecorator | undefined>('activityLogger', context.getHandler());
    const { method, url, headers, body, ip, user, params, query } = context.switchToHttp().getRequest<TypedRequest>();

    if (method === 'GET' && !decorator) {
      return next.handle();
    }

    const start = Date.now();
    const response = context.switchToHttp().getResponse<ExpressResponse>();
    let { statusCode } = response;

    const endpoint = url.split('?')[0].replace(/\/api\/v\d+\//, '');

    const controllerName = context.getClass().name.replace('Controller', '').toLowerCase();
    const resourceName = decorator?.resource ?? controllerName ?? 'Unidentified resource';

    let responseJson = {};

    const defaultDescription = `La ressource ${resourceName} a été ${methodMapping[method] || method}`;

    // Get resource Id dynamically (based on two fields : location and name)
    let resourceId: string | null = null;

    if (decorator) {
      const nameId = decorator?.nameId ?? 'id';

      switch (decorator?.locationId) {
        case LocationId.BODY:
          if (typeof body[nameId] === 'string' || typeof body[nameId] === 'number') {
            resourceId = body[nameId].toString();
          }
          break;
        case LocationId.QUERY_PARAM:
          if (typeof query[nameId] === 'string' || typeof query[nameId] === 'number') {
            resourceId = query[nameId].toString();
          }
          break;
        // case LocationId.PARAM
        default:
          resourceId = params[nameId];
          break;
      }
    }

    return next.handle().pipe(
      tap((result: Record<string, unknown>) => {
        responseJson = { headers: response.getHeaders(), body: result };
      }),
      catchError((error: unknown) => {
        const { responseError, httpStatus } = catchActivityLoggerError(error, statusCode);
        statusCode = httpStatus;

        responseJson = { headers: response.getHeaders(), body: responseError };
        return throwError(() => error);
      }),
      finalize(() => {
        const request = context.switchToHttp().getRequest<TypedRequest>();
        const contentType = request.headers['content-type'];
        let bodyParsed = body;
        if (contentType?.includes('multipart/form-data')) {
          bodyParsed = request.body;
        }

        if (!user) {
          this.logger.error('User not found during creating log');
          return;
        }

        const headerExternalUserId = headers['USER-ID'];
        const externalUserId =
          typeof headerExternalUserId === 'string' ? headerExternalUserId : headerExternalUserId?.join(', ');

        // Delete sensible headers keys
        delete headers['x-api-key'];
        delete headers['user-id'];

        void this.activityLoggerService.createLog({
          user,
          externalUserId,
          requestBody: JSON.stringify(bodyParsed),
          responseBody: JSON.stringify(responseJson),
          ipAddress: ip,
          headers: JSON.stringify(headers),
          uri: url,
          statusCode,
          endpoint,
          method,
          resourceName,
          resourceId,
          duration: Date.now() - start,
          description: decorator?.description || defaultDescription,
        });
      }),
    );
  }
}
