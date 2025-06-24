import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from '@src/activity-logger/entities/activity-logger.entity';
import { dataSourceOptions } from '@src/orm/data-source';
import { Role } from '@src/users/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TypeOrmModule.forFeature([User, Role, ActivityLog])],
})
export class CliModule {}
