import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-logger.entity';
import { ActivityLoggerService } from './services/activity-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  providers: [ActivityLoggerService],
  exports: [ActivityLoggerService],
})
export class ActivityLoggerModule {}
