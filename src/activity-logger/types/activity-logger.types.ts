import { LoggedUser } from '@src/auth/types/logged-user.type';
import { Resources } from './resource.types';

export class CreateActivityLogServiceDto {
  user: LoggedUser;
  externalUserId?: string;
  requestBody: string;
  responseBody: string;
  ipAddress?: string;
  headers: string;
  endpoint: string;
  method: string;
  resourceName: string;
  duration: number;
  uri: string;
  statusCode: number;
  resourceId: string | null;
  description?: string;
}

export enum LocationId {
  PARAM = 'PARAM',
  QUERY_PARAM = 'QUERY_PARAM',
  BODY = 'BODY',
}

export interface ActivityLoggerDecorator {
  description: string;
  resource?: Resources;
  nameId?: string;
  locationId?: LocationId;
}
