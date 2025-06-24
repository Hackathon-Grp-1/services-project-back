import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeleteEntity } from '../../common/entities/soft-delete.entity';
import { User } from '../../users/entities/user.entity';
import { OrganizationEconomicSizeKind } from '../types/organization.types';

@Entity('organizations')
export class Organization extends SoftDeleteEntity {
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ApiProperty({ type: () => User, required: false })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @ApiProperty({ required: false })
  @Column({ name: 'legal_name', type: 'varchar', length: 64, nullable: true })
  legalName?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'brand', type: 'varchar', length: 32, nullable: true })
  brand?: string;

  @ApiProperty({ enum: OrganizationEconomicSizeKind, default: OrganizationEconomicSizeKind.FREELANCER })
  @Column({
    name: 'o_size',
    type: 'enum',
    enum: OrganizationEconomicSizeKind,
    default: OrganizationEconomicSizeKind.FREELANCER,
  })
  oSize: OrganizationEconomicSizeKind;

  @ApiProperty({ required: false })
  @Column({ name: 'juridic_form', type: 'varchar', length: 8, nullable: true })
  juridicForm?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'juridic_cat_label', type: 'varchar', length: 64, nullable: true })
  juridicCatLabel?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'juridic_cat_code', type: 'varchar', length: 8, nullable: true })
  juridicCatCode?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'currency', type: 'varchar', length: 8, default: 'eur' })
  currency: string;

  @ApiProperty({ required: false })
  @Column({ name: 'legal_uniq_identifier', type: 'varchar', length: 64, nullable: true })
  legalUniqIdentifier?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'vat_number', type: 'varchar', length: 32, nullable: true })
  vatNumber?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'community_vat_number', type: 'varchar', length: 32, nullable: true })
  communityVatNumber?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'capital', type: 'integer', nullable: true })
  capital?: number;

  @ApiProperty({ required: false })
  @Column({ name: 'insurance_ref', type: 'varchar', length: 64, nullable: true })
  insuranceRef?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'insurance_name', type: 'varchar', length: 64, nullable: true })
  insuranceName?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'activity_started_at', type: 'timestamp', nullable: true })
  activityStartedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ name: 'activity_ended_at', type: 'timestamp', nullable: true })
  activityEndedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ required: false })
  @Column({ name: 'summary', type: 'text', nullable: true })
  summary?: string;

  @ApiProperty({ type: () => Organization, required: false })
  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'parent_organization_id' })
  parentOrganization?: Organization;
}
