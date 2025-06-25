import { ApiProperty } from '@nestjs/swagger';
import { ActivityLog } from '@src/activity-logger/entities/activity-logger.entity';
import { Service } from '@src/business/entities/service.entity';
import { SoftDeleteEntity } from '@src/common/entities/soft-delete.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { UserType } from '../types/user.types';
import { Role } from './role.entity';

@Entity()
export class User extends SoftDeleteEntity {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @Column()
  lastName: string;

  @ApiProperty({ enum: UserType, example: UserType.API, default: UserType.INTERNAL })
  @Column({ type: 'enum', enum: UserType, default: UserType.INTERNAL })
  type: UserType;

  @ApiProperty({ description: 'Email of the user', uniqueItems: true, nullable: true })
  @Column({ unique: true, nullable: true })
  email?: string;

  @ApiProperty({ description: 'Hashed password of the user', nullable: true })
  @Column({ select: false, nullable: true })
  password?: string;

  @ApiProperty({ description: 'Secret used to log in', nullable: true })
  @Column({ unique: true, select: false, nullable: true })
  apiKey?: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @Column({ type: 'character varying', nullable: true })
  phoneNumber?: string | null;

  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role, (role) => role.users)
  role: Relation<Role>;

  @ApiProperty({ nullable: true, type: () => ActivityLog })
  @OneToMany(() => ActivityLog, (log) => log.user)
  logs: Relation<ActivityLog[]>;

  @ApiProperty({ nullable: true, type: () => Service })
  @OneToMany(() => Service, (service) => service.user)
  services: Relation<Service[]>;
  @ApiProperty({ description: 'Token temporaire pour la réinitialisation du mot de passe', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken?: string | null;

  @ApiProperty({ description: 'Expiration du token de réinitialisation', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  resetPasswordTokenExpires?: Date | null;
}
