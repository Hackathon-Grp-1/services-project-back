import { SetMetadata } from '@nestjs/common';
import { ActivityLoggerDecorator } from '../types/activity-logger.types';

export const ActivityLogger = (data: ActivityLoggerDecorator) => SetMetadata('activityLogger', data);
