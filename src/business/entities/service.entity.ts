import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { SoftDeleteEntity } from '../../common/entities/soft-delete.entity';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';

@Entity('services')
export class Service extends SoftDeleteEntity {
  @ApiProperty()
  @Column({ name: 'first_name', type: 'varchar', length: 64 })
  firstName: string;

  @ApiProperty()
  @Column({ name: 'last_name', type: 'varchar', length: 64 })
  lastName: string;

  @ApiProperty({ required: false, type: () => Organization })
  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;

  @ApiProperty()
  @Column({ name: 'phone', type: 'varchar', length: 32 })
  phone: string;

  @ApiProperty()
  @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2 })
  hourlyRate: number;

  @ApiProperty()
  @Column({ name: 'professional_description', type: 'text' })
  professionalDescription: string;

  @ApiProperty()
  @Column({ name: 'skills_description', type: 'text' })
  skillsDescription: string;

  @ApiProperty({ type: [String] })
  @Column({ name: 'skills', type: 'simple-array' })
  skills: string[];

  @ApiProperty()
  @Column({ name: 'domain', type: 'varchar', length: 64 })
  domain: string;

  @ApiProperty()
  @Column({ name: 'short_professional_description', type: 'varchar', length: 256 })
  shortProfessionalDescription: string;

  @ApiProperty()
  @Column({ name: 'short_skills_description', type: 'varchar', length: 256 })
  shortSkillsDescription: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: false })
  user: User;
}
