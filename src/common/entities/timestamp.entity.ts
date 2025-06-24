import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class TimestampEntity extends BaseEntity {
  @ApiProperty({ example: '2025-04-17T08:00:00.303Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-17T10:00:00.303Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
