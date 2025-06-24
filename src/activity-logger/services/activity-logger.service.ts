import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-logger.entity';
import { CreateActivityLogServiceDto } from '../types/activity-logger.types';

@Injectable()
export class ActivityLoggerService {
  private readonly logger = new Logger('Activity Log');

  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLoggerRepository: Repository<ActivityLog>,
  ) {}

  async createLog(createActivityLogDto: CreateActivityLogServiceDto) {
    const activityLog = plainToInstance(ActivityLog, { ...createActivityLogDto });

    try {
      await this.activityLoggerRepository.save(activityLog);
    } catch (error) {
      this.logger.error(`Failed to save activity log : ${JSON.stringify(error)}`);
      throw new Error('Error saving activity log. Please try again later.');
    }
  }

  async find(): Promise<ActivityLog[]> {
    return await this.activityLoggerRepository.find({ order: { createdAt: 'desc' } });
  }
}
