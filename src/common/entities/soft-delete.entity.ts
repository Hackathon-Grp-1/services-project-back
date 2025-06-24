import { ApiProperty } from '@nestjs/swagger';
import { DeleteDateColumn } from 'typeorm';
import { TimestampEntity } from './timestamp.entity';

export abstract class SoftDeleteEntity extends TimestampEntity {
  @ApiProperty({ example: '2025-04-17T10:00:00.303Z' })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
